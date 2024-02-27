import { FrameRequest, FrameButtonMetadata, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { DFBCLIST } from '../../../dfbclist'; 

type FName = {
  fname: string;
  image: string;
}

const HOST_URL = 'http://fox-meets-fox.vercel.app';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let fid = 0;
  
  // get frame request message
  const body: FrameRequest = await req.json();
  const { isValid, message } = 
    await getFrameMessage(body, { 
      neynarApiKey: process.env.NEYNAR_API_KEY || '', 
      allowFramegear: true,
    });
  
  // check frame request message
  if (isValid) fid = message.interactor.fid;
  
  if (!fid) return buildResponse(ResponseType.INVALID_MESSAGE);
  
  if (message?.button === 2) {
    const fname = req.nextUrl.searchParams.get("fname");
    return NextResponse.redirect(
      'https://warpcast.com/' + fname,
      { status: 302 },
    );
  }

  const nextIndex = Math.floor(Math.random() * (DFBCLIST.length));
  const nextFname: FName = DFBCLIST[nextIndex];
  
  if (!nextFname) return buildResponse(ResponseType.ERROR);
  
  return buildResponse(ResponseType.SUCCESS, nextFname);
}

enum ResponseType {
  SUCCESS,
  INVALID_MESSAGE,
  ERROR
}

async function buildResponse(type: ResponseType, fname?: FName): Promise<NextResponse> {
  const IMAGE = {
    [ResponseType.SUCCESS]: fname!.image,
    [ResponseType.INVALID_MESSAGE]: HOST_URL + '/status/invalid-message.png',
    [ResponseType.ERROR]: HOST_URL + '/status/error.png',
  }[type];
  const shouldRetry = 
    type === ResponseType.ERROR || type === ResponseType.INVALID_MESSAGE;
  const buttons: [FrameButtonMetadata, ...FrameButtonMetadata[]] | undefined = shouldRetry ? 
    [{ label: '🦊️🎩️ meets 🦊️🎩️' } as FrameButtonMetadata] 
      : [
          { label: '🦊️🎩️ meets 🦊️🎩️' }, 
          { label: `Meet @${fname!.fname}`, action: 'post_redirect' } as FrameButtonMetadata
        ];
  return new NextResponse(getFrameHtmlResponse({
    buttons,
    image: {
      src: IMAGE,
      aspectRatio: '1:1'
    },
    postUrl: HOST_URL + '/api/frame/fmf' + (!shouldRetry ? `?fname=${fname!.fname}` : '')
  }));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

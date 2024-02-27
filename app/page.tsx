import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const HOST_URL = 'http://fox-meets-fox.vercel.app';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: '🦊️🎩️ meets 🦊️🎩️'
    }
  ],
  image: {
    src: HOST_URL + '/fox_meeting.png',
    aspectRatio: '1:1'
  },
  postUrl: HOST_URL + '/api/frame/fmf'
});

const title = 'DegentleFox meets DegentleFox';
const description = 'Farcaster frame for easy meeting other members of the DegentleFox Based Club';
const images = [HOST_URL + '/fox_meeting.png'];

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images
  },
  metadataBase: new URL(HOST_URL),
  other: {
    ...frameMetadata
  }
};


export default function Page() {
  return (
    <>
      <h1>DegentleFox meets DegentleFox, Based</h1>
    </>
  );
}

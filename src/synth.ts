import execTts from './execTts';
import writeToTmpFile from './writeToTmpFile';

export default async (text: string): Promise<string> => {
  console.log('sync-text', text);
  const tmpFile = await writeToTmpFile(text);
  console.log('tmpFile', tmpFile);

  await execTts(tmpFile);

  // TODO: make cli call
  return 'https://exampl.com/test.mp3';
};

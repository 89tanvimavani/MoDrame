//import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
//import RNFS from 'react-native-fs';
//import { v4 as uuid } from 'uuid'
import { Video } from 'react-native-compressor';


export const _compress = async (source) => {
  try {   
    // const session = await FFmpegKit.execute(`-i ${source} -ss 00:00:00 -to 00:02:00 -vf scale=720:1280 -b:v 2M -c:v mpeg4 ${destination}`)

    // const returnCode = await session.getReturnCode()

    // if (ReturnCode.isSuccess(returnCode)) {
    //   return destination
    // }
    // else return source

    const result = await Video.compress(
      source,
      {
        compressionMethod: 'auto',
        maxSize: 1280,
        minimumFileSizeForCompress: 32,
        // getCancellationId for get video id which we can use for cancel compression
        getCancellationId: (cancellationId) => ({}),
      },
      (progress) => {}
    );

    return result

  } catch (err) {
    return source
  }
}

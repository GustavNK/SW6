module WavePacker

open System.IO
open System.Text

// TODO 7 Write data to stream
// http://soundfile.sapp.org/doc/WaveFormat/
// subchuncksize 16
// audioformat: 1s
// num channels: 1s
// sample rate: 44100
// byte rate: sample rate *16/8
// block origin: 2s
// bits per sample: 16s
let pack (d: int16[]) =
    let stream = new MemoryStream()
    let writer = new BinaryWriter(stream, Encoding.ASCII)
    let dataLength = Array.length d*2   
    
    // RIFF
    writer.Write('R') //chunkID
    writer.Write('I') //chunkID
    writer.Write('F') //chunkID
    writer.Write('F') //chunkID
    writer.Write(36 + 16) //ChunkSize
    writer.Write('W') //Format
    writer.Write('A')
    writer.Write('v')
    writer.Write('E')
    //failwith "Implement here"

    // fmt
    writer.Write('f') //Subchunk1ID
    writer.Write('m')
    writer.Write('t')
    writer.Write(' ')
    writer.Write(16) //Subchunk1Size
    writer.Write(1s) //AudioFormat
    writer.Write(1s) //NumChannels
    writer.Write(44100) //SampleRate
    writer.Write(44100 * 2) //ByteRate
    writer.Write(2s) //BlockAlign
    writer.Write(16s) //BitsPerSample
    
    // data
    writer.Write('d') //Subchunk2ID
    writer.Write('a')
    writer.Write('t')
    writer.Write('a')
    writer.Write(dataLength) //Subchunk2Size
    
    for i in d do
        writer.Write(i)

    stream
    
let Write filename (ms: MemoryStream) =
    use fs = new FileStream(Path.Combine(__SOURCE_DIRECTORY__, filename), FileMode.Create) // use IDisposible
    ms.WriteTo(fs)

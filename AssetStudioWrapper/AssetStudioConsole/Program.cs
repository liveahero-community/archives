using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using AssetStudioGUI;

namespace AssetStudioConsole
{
    static class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Usage: `Program.exe <sourcePath> <outputPath>`");

            var path = args[0];
            var savePath = args[1];

            await Task.Run(() => Studio.assetsManager.LoadFolder(path));
            await Task.Run(() => Studio.BuildAssetData());
            await Task.Run(() => Studio.BuildClassStructure());

            var exportedRecords = new List<string> { };
            var exportableAssets = new List<AssetItem> { };
            foreach (var asset in Studio.exportableAssets)
            {
                if (!exportedRecords.Contains(asset.SourceFile.originalPath))
                {
                    exportedRecords.Add(asset.SourceFile.originalPath);
                    exportableAssets.Add(asset);
                }
            }

            foreach (var asset in exportableAssets)
            {
                string exportPath = Path.Combine(savePath, asset.TypeString) + Path.DirectorySeparatorChar;
                Exporter.ExportConvertFile(asset, exportPath);
                Console.WriteLine(Path.Combine(savePath, asset.SourceFile.fullName));
            }

            Console.WriteLine("Finish all works");
        }
    }
}

local lfs = require("lfs")

local function listFolders(path)
    for folder in lfs.dir(path) do
        local folderAttributes = lfs.attributes(path .. '/' .. folder)
        if folderAttributes and folderAttributes.mode == "directory" and folder ~= "." and folder ~= ".." then
            print(folder)
            for imageFile in lfs.dir(path .. '/' .. folder) do
                if imageFile ~= "." and imageFile ~= ".." then
                    print(imageFile)
                end
            end
        end
    end
end

local directoryPath = "resources/"  -- Change this to your folder path
listFolders(directoryPath)
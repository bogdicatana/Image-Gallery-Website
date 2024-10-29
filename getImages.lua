local lfs = require("lfs")

local function listFolders(path)
    for file in lfs.dir(path) do
        local attr = lfs.attributes(path .. '/' .. file)
        if attr and attr.mode == "directory" and file ~= "." and file ~= ".." then
            print(file)  -- Print folder name
        end
    end
end

local directoryPath = "resources/"  -- Change this to your folder path
listFolders(directoryPath)
local lfs = require("lfs")

local json = require("dkjson")

local function loadImagesToJson(path)
    local data = {}

    for folder in lfs.dir(path) do
        local folderAttributes = lfs.attributes(path .. '/' .. folder)
        if folderAttributes and folderAttributes.mode == "directory" and folder ~= "." and folder ~= ".." then
            data[folder] = {}

            for imageFile in lfs.dir(path .. '/' .. folder) do
                if imageFile ~= "." and imageFile ~= ".." then
                    table.insert(data[folder], imageFile)
                end
            end
        end
    end

    local jsonString = json.encode(data, { indent = true })
    local file = io.open("images.json", "w")
    if file then
        file:write(jsonString)
        file:close()
    else
        print("Error: Could not open file for writing.")
    end
end


local directoryPath = "resources/"
loadImagesToJson(directoryPath)
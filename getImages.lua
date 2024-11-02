local lfs = require("lfs")


-- This is just so you can print the files if you want to check the files out before putting them in a db
-- local function listFolders(path)
--     for folder in lfs.dir(path) do
--         local folderAttributes = lfs.attributes(path .. '/' .. folder)
--         if folderAttributes and folderAttributes.mode == "directory" and folder ~= "." and folder ~= ".." then
--             print(folder)
--             for imageFile in lfs.dir(path .. '/' .. folder) do
--                 if imageFile ~= "." and imageFile ~= ".." then
--                     print(imageFile)
--                 end
--             end
--         end
--     end
-- end

local sqlite3 = require("lsqlite3")

local function loadImagesToDatabase(path)
    local db = sqlite3.open("images.db")

    db:exec([[
        CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        );
    ]])

    for folder in lfs.dir(path) do
        local folderAttributes = lfs.attributes(path .. '/' .. folder)
        if folderAttributes and folderAttributes.mode == "directory" and folder ~= "." and folder ~= ".." then
            db:exec("INSERT OR IGNORE INTO folders (name) VALUES ('" .. folder .. "');")

            db:exec([[
                CREATE TABLE IF NOT EXISTS ]] .. folder .. [[ (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    file_name TEXT
                );
            ]])

            for imageFile in lfs.dir(path .. '/' .. folder) do
                if imageFile ~= "." and imageFile ~= ".." then
                    db:exec("INSERT INTO " .. folder .. " (file_name) VALUES ('" .. imageFile .. "');")
                end
            end
        end
    end

    db:close()
end


local directoryPath = "resources/"  -- Change this to your folder path
-- listFolders(directoryPath)
loadImagesToDatabase(directoryPath)
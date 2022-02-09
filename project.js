#!/usr/bin/env node

const { dir } = require("console");
let fs= require("fs");
let p=require("path");


let type={
    movies: ['mkv','mov','mp4','flv'],
    songs: ['mp3','flac','wav','wma','aac',],
    documents:['pdf','docx','doc','xlsx','txt','xls','odp','ods','odg','ppt'],
    programs:['java','cpp','c','py','html','css','js'],
    images:['jpeg','jpg','png','JPG','bmp'],
    applications:['exe','msi','pkg','dmg']
}

let inputArr=process.argv.slice(2);

let work=inputArr[0];

switch(work)
{
    case "organise":
        if(inputArr[1]==undefined)
            path=process.cwd();
        else
            path=inputArr[1];
        organisefn(path);
        break;
    case "tree":
        if(inputArr[1]==undefined)
            path=process.cwd();
        else
            path=inputArr[1];
        treefn(path);
        break;
    case "help":
        helpfn();
        break;
    case "exit":
        console.log("Exit");
        break;
    default:
        console.log("pleasae enter valid command");
        break;
}


function organisefn(dirpath)
{
    let newDirectory=p.join(dirpath,"organized_folder");

    if(fs.existsSync(newDirectory)==false)
    {
        fs.mkdirSync(newDirectory);
        console.log("created new folder");
    }
    
    let Allfiles=fs.readdirSync(dirpath);
   
    let numberOfFiles=0;
    for(let i=0;i<Allfiles.length;i++)
    {
        let checkingIfFolder=p.join(dirpath,Allfiles[i]);
        if(fs.lstatSync(checkingIfFolder).isDirectory()==true)
        {
            continue;
        }
        numberOfFiles++;  // if a folder comes it is not counted as loop gets continued..
        let fileType=p.extname(Allfiles[i]).slice(1);
        let toCopyFolder=undefined;
        for(let key in type)
        {
           listOfTypes=type[key];
            for(let i=0;i<listOfTypes.length;i++)
            {
                if(listOfTypes[i]==fileType)
                {
                    toCopyFolder=key;
                    break;
                }
            }
            if(toCopyFolder!=undefined)
            {
                break;
            }
        }        

        if(toCopyFolder!=undefined)
        {
            let newFolder=p.join(newDirectory,toCopyFolder);
            if(fs.existsSync(newFolder)==false)
            {
                fs.mkdirSync(newFolder);
            }
            let srcPath=p.join(dirpath,Allfiles[i]);
            let desPath=p.join(newFolder,Allfiles[i]);  // new folder tak we only have the path. we added the file name so a new file is created and data is copied to that new created file from source file
                                                       // if we dont add file name then error will come.
            fs.copyFileSync(srcPath,desPath);
            fs.unlinkSync(srcPath);
        }
        else
        {
            let newFolder=p.join(newDirectory,"Others");
            if(fs.existsSync(newFolder)==false)
            {
                fs.mkdirSync(newFolder);
            }
            let srcPath=p.join(dirpath,Allfiles[i]);
            let desPath=p.join(newFolder,Allfiles[i]);
            let checkingIfFolder=p.join(dirpath,Allfiles[i]);
            fs.copyFileSync(srcPath,desPath);
            fs.unlinkSync(srcPath);
            
        }
    }
    console.log("copied all ",numberOfFiles," files");
    

}

function treefn(dirpath)
{
    treehelper(dirpath,"");

    console.log("\n");
    console.log("------------------- Finished----------------");
}

function treehelper(path,indent) // indent is for space
{
    let AllFilesAndFolders= fs.readdirSync(path);
    for(let i=0;i<AllFilesAndFolders.length;i++)
    {
        let checkingSubFolders=p.join(path,AllFilesAndFolders[i]);
        console.log(indent,"|---> ",AllFilesAndFolders[i]);
        if(fs.lstatSync(checkingSubFolders).isDirectory()==true)
        {
            treehelper(checkingSubFolders,indent+"\t");     // using recursion
        }
        
    }
}

function helpfn()
{
    console.log(`List of commands are : 
                  |--> organise
                  |--> tree
                  |--> help
                  |--> exit`);
}
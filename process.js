var fs = require("fs");

var myFiles = []; //存储所有文件信息的大数组对象

//读取所有文件内容，整合为一个JSON对象
function getAllFilesContent(dirPath) {

    fs.readdir(dirPath, function(error,files) {
         //对目录下的每一个文件，进行遍历操作
      files.forEach(function(file){
          doProcess1(dirPath, file);
    })

    doProcess2(myFiles);

 })
}

function doProcess1(dirPath ,file){

    var file_info = getFileInfo(file);

    if(file_info.ext == '.txt'){

        var output = 'File:' + file + ':\n',
            file_content = fs.readFileSync(dirPath + file, 'utf8'); //file_content 为一个字符串，经过处理，变成一个对象，对象包含了文件中的专利数量和专利的名称数组
        var fileObj = getFormatedContentObj(file_content);

        //未去重之前，得到专利的数组和数量
        var file_content_arr = fileObj.patent_arr, nums = fileObj.nums;

        // 去重之前的文件信息
        output += '去重之前专利数量：' + nums + '个,\n';

        for(var i=0;i<file_content_arr.length;i++) {
            //输出去重之前的文件内容
            //output+=file_content_arr[i]+'\n';
        }

        //得到去重之后的数组对象
        var clearDuplicatedObj = clearDuplicate(file_content_arr),
            clearedDuplicateArray = clearDuplicatedObj.delDuplicateArray;
            clearedDuplicateArray.push('-----' + file_info.name);
        //去重之后的文件信息
        output += '重复专利数量' + clearDuplicatedObj.isDuplicateNum + '个，去重之后专利数量为：' + clearDuplicatedObj.delDuplicateArrayLength + '个\n';

        for(var i=0;i<clearDuplicatedObj.delDuplicateArray.length;i++) {
            //输出去重之后的文件内容
            //output+=clearDuplicatedObj.delDuplicateArray[i]+'\n';
        }

        // fs.appendFileSync("./output.txt", clearDuplicatedObj.delDuplicateArray + '\n\n\n');
        myFiles.push(clearedDuplicateArray);
        // output +='专利数量：' + nums + '个, 重复专利个数：' + clearDuplicatedObj.isDuplicateNum +', 所有不重复的专利个数为：' + clearDuplicatedObj.delDuplicateArrayLength +',\n';
        fs.appendFileSync("./output1.txt", output + '\n');
    }

}

function doProcess2(myFiles){
    var output2='';
//    console.log(myFiles);
//    /获取所有文件的内容信息，变为一个数组
    for(var i=0;i<myFiles.length-2;i++) {
        var len1 = myFiles[i].length, file1name = myFiles[i][len1-1], len2, file2name, count=0;
        for(var j=i+1;j<myFiles.length;j++) {
            len2 = myFiles[j].length, file2name = myFiles[j][len2-1];
            //比较两个数组，myFiles[i], myFiles[j]，计算二者之间的相同专利数量
            for(var m=0;m<myFiles[i].length-1;m++) {
                for(var n=0;n<myFiles[j].length-1;n++) {
                    if(m ==0 && n == 0){
                        output2 += '\nFile:'+ file1name + '.txt 对比 File:'+ file2name + '.txt\n';
                    }
                    if(myFiles[i][m] == myFiles[j][n]) {
                        count++;
                        output2 += count + ':' + myFiles[j][n] + '\n';
                    }
                }
            }
            output2 += 'File:'+ file1name + '.txt 对比 File:'+ file2name + '.txt ' + '相同专利数量为：' + count + '\n\n';
            count = 0;
        }
    }
    fs.appendFileSync('./output2.txt',output2);
}

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g,'');
}

//把文件内容变成标准数组
function getFormatedContentObj(str) {
 var arr = Array();
 var tmpArr = str.split(";");
 for(var i=0;i<tmpArr.length;i++) {
  if(trim(tmpArr[i]) == ''){
   continue;
  }
  var patent_content = trim(tmpArr[i]).split(/(\s)+/);
        arr.push(trim(patent_content[0]));
 }
 var nums = arr.length;
    return {
        'nums' : nums,
        'patent_arr' : arr
    }
}

//每个文件中的内容，进行去重处理
function clearDuplicate(arr) {
 var len = arr.length,isDuplicateNum=0;
 var hashObj = {},tmp = Array(),duplicatedArray = Array();
 for(var i=0;i<arr.length;i++) {
  if(!hashObj[arr[i]]) {
   hashObj[arr[i]] = true;
   tmp.push(arr[i]);
  }else{
   duplicatedArray.push(arr[i]);
   len--;
   isDuplicateNum++;
  }
 }

 return {
  'delDuplicateArray' : tmp,
  'duplicatedArray' : duplicatedArray,
  'delDuplicateArrayLength' : len,
  'isDuplicateNum' : isDuplicateNum
 }
}



function getFileInfo(filename) {
 var pos = filename.indexOf(".");
 var name = filename.substring(0,pos);
 var ext = filename.substring(pos,filename.length);
 return {
  'name' : name,
  'ext' : ext
 }
}

getAllFilesContent("resoures/");













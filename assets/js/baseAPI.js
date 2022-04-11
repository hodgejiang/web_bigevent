$.ajaxPrefilter(function(option){
    console.log(option.url)
    option.url = 'http://www.liulongbin.top:3007'+option.url;
})
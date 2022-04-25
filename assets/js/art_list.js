$(function(){

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1,//页码值，默认第一页的数据
        pagesize: 2,//每页显示几条数据，默认每页显示两条
        cate_id:'',//文章分类的Id
        state:''//文章的发布状态
    }

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt  = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y+'-'+ m + '-' + d + '' + hh + ':' + mm +':'+ss
    }

    function padZero(n) {
        return n > 9 ? n: '0'+n
    }

    initTable()
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面数据
               var htmlStr = template('tpl-table',res)
               $('tbody').html(htmlStr)
               renderPage(res.total)
            } 
        })
    }

    initCate()
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败！')
                }

                //调用模板引擎渲染分类的可选项
              var htmlStr = template('tpl-cate',res)
              console.log(htmlStr)
              $('[name=cate_id]').html(htmlStr)
              form.render()
            }
        })
    }
    //为筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染
        initCate()
     })

     function renderPage(total) {
         //触发jump回调的方式有两种
        //1 点击页码的时候，触发jump
        //2 调用laypage.render()方法
        //如果first的值为true，证明是方式2触发的
         laypage.render({
             elem:'pageBox',//分页容器的id
             count:total,//总数据条数
             limit:q.pagesize,//每页显示几条数据
             curr:q.pagenum,//设置默认被选中的分页
             layout:['count','limit','prev','page','next','skip'],
             limits:[2,3,5,10],
             jump:function(obj,first){
                 //把最新的页码值复制到q这个查询参数对象中
                 q.pagenum = obj.curr
                 q.pagesize = obj.limit


                 if(!first){
                     initTable()
                 }
                
             }


         })
     }


     $('tbody').on('click','.btn-delete',function(){
         //获取删除按钮的个数
         var len = $('.btn-delete').length
         var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status !==0 ){
                        return layer.msg('删除文章失败！')
                    }

                    
                    layer.msg('删除文章成功！')
                    if(len ===1 ){
                        q.pagenum = q.pagenum === 1 ? 1:q.pagenum -1
                    }
                    initTable()
                }

            })
            layer.close(index);
          });
     })
})
// todo 模擬前端作業
const content = document.getElementById('content');
const send = document.getElementById('send');
const list = document.getElementById('list');

// todo 新增增料到資料庫
    send.addEventListener('click', function(e){
        let txt = content.value;
        const xhr = new XMLHttpRequest();
            xhr.open('post', '/addContent');
            xhr.setRequestHeader('Content-type','application/json');
        let txtJson = JSON.stringify({'content':txt});
            xhr.send(txtJson);
            xhr.onload = function(){
                let res = JSON.parse(xhr.responseText);
                    console.log(res);

                    if(res.success !== true){
                        alert('新增失敗');
                        return;
                    };

                    let str = '';
                    let data = res.content;
                    console.log(data);
                    for(let i in data){
                        // console.log(data[i]);
                        str += `
                            <li> ${data[i].content} <input type="submit" id="send" data-id="${i}" value"刪除"></input></li>
                        `;
                    }
                    list.innerHTML = str;
            };
    }, false);

// todo 刪除資料addContent
    list.addEventListener('click', function(e){
        // console.log(e.target.dataset.id);
        let delId = e.target.dataset.id;
        const xhr = new XMLHttpRequest();
            xhr.open('post', '/removeData');
            xhr.setRequestHeader('Content-type','application/json');
        let del = JSON.stringify({'id':delId});
            xhr.send(del);
            xhr.onload = function(){
                let res = JSON.parse(xhr.responseText);
                    console.log(res);

                let str = '';
                let data = res.result;
                console.log(data);
                for(let i in data){
                    // console.log(data[i]);
                    str += `
                        <li> ${data[i].content} <input type="submit" id="send" data-id="${i}" value="刪除"></inpu></li>
                    `;
                }
                list.innerHTML = str;
            };
    }, false);
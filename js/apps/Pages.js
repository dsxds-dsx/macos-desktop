window.renderPages = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#fff';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    const defaultDocs = [
        { id: 1, title: '项目计划书', content: '<h1>2024年度项目计划书</h1><h2>一、项目概述</h2><p>本项目旨在开发一款创新的桌面应用，提供卓越的用户体验。</p><h2>二、目标</h2><ul><li>提升用户满意度至95%</li><li>完成核心功能开发</li><li>实现跨平台支持</li></ul><p>请团队成员按照计划推进各项工作。</p>', modified: Date.now() - 86400000 },
        { id: 2, title: '会议纪要', content: '<h1>产品评审会议纪要</h1><p><strong>时间：</strong>2024年1月15日</p><p><strong>参会人员：</strong>产品、设计、开发团队</p><h2>讨论要点</h2><ol><li>新版本功能优先级确定</li><li>UI设计方案评审通过</li><li>发布时间定为下月初</li></ol>', modified: Date.now() - 172800000 },
        { id: 3, title: '个人简历', content: '<h1 style="text-align:center;">个人简历</h1><p style="text-align:center;">邮箱：example@email.com | 电话：138-0000-0000</p><h2>教育背景</h2><p>2018-2022 某大学 计算机科学与技术</p><h2>工作经验</h2><p>2022至今 某科技公司 前端开发工程师</p>', modified: Date.now() - 259200000 }
    ];

    let docs = JSON.parse(localStorage.getItem('pages_docs') || JSON.stringify(defaultDocs));
    let currentDocId = parseInt(localStorage.getItem('pages_current') || '1');
    let isBold = false, isItalic = false, isUnderline = false;

    function save() {
        localStorage.setItem('pages_docs', JSON.stringify(docs));
        localStorage.setItem('pages_current', currentDocId.toString());
    }

    function getCurrentDoc() {
        return docs.find(d => d.id === currentDocId) || docs[0];
    }

    function render() {
        const doc = getCurrentDoc();
        content.innerHTML = `
            <div style="display:flex;flex:1;overflow:hidden;">
                <div style="width:220px;background:#f5f5f5;border-right:1px solid #ddd;display:flex;flex-direction:column;">
                    <div style="padding:12px;border-bottom:1px solid #ddd;display:flex;gap:8px;">
                        <button id="pages-newDoc" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;font-size:12px;">＋ 新建文稿</button>
                    </div>
                    <div style="flex:1;overflow-y:auto;" id="pages-docList"></div>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
                    <div style="height:48px;background:linear-gradient(180deg,#fafafa,#f0f0f0);border-bottom:1px solid #ddd;display:flex;align-items:center;padding:0 12px;gap:8px;">
                        <select id="pages-fontFamily" style="padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                            <option>-apple-system</option><option>Helvetica</option><option>Arial</option><option>Times New Roman</option>
                        </select>
                        <select id="pages-fontSize" style="padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;width:60px;">
                            <option>12</option><option selected>14</option><option>16</option><option>18</option><option>24</option><option>32</option><option>48</option>
                        </select>
                        <div style="width:1px;height:24px;background:#ddd;margin:0 4px;"></div>
                        <button class="format-btn" data-cmd="bold" style="width:28px;height:28px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;font-weight:bold;">B</button>
                        <button class="format-btn" data-cmd="italic" style="width:28px;height:28px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;font-style:italic;">I</button>
                        <button class="format-btn" data-cmd="underline" style="width:28px;height:28px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;text-decoration:underline;">U</button>
                        <div style="width:1px;height:24px;background:#ddd;margin:0 4px;"></div>
                        <button class="align-btn" data-align="left" style="width:28px;height:28px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;">⬅</button>
                        <button class="align-btn" data-align="center" style="width:28px;height:28px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;">⬌</button>
                        <button class="align-btn" data-align="right" style="width:28px;height:28px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;">➡</button>
                        <div style="width:1px;height:24px;background:#ddd;margin:0 4px;"></div>
                        <button class="list-btn" data-list="ul" style="padding:4px 8px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;font-size:12px;">• 列表</button>
                        <button class="list-btn" data-list="ol" style="padding:4px 8px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;font-size:12px;">1. 编号</button>
                        <div style="flex:1;"></div>
                        <span style="font-size:11px;color:#999;" id="pages-wordCount"></span>
                    </div>
                    <div style="flex:1;overflow:auto;background:#e8e8e8;padding:30px;display:flex;justify-content:center;">
                        <div id="pages-editor" contenteditable="true" style="width:100%;max-width:800px;min-height:1000px;background:#fff;padding:60px 80px;box-shadow:0 4px 20px rgba(0,0,0,0.15);outline:none;font-size:14px;line-height:1.8;font-family:-apple-system,sans-serif;">${doc.content}</div>
                    </div>
                </div>
            </div>
        `;

        const listEl = content.querySelector('#pages-docList');
        docs.forEach(d => {
            const item = document.createElement('div');
            item.className = 'pages-doc-item';
            item.style.cssText = `padding:12px 16px;cursor:pointer;border-bottom:1px solid #e8e8e8;${d.id === currentDocId ? 'background:#e3f2fd;' : ''}`;
            item.innerHTML = `<div style="font-weight:500;font-size:13px;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.title}</div><div style="font-size:11px;color:#888;">${new Date(d.modified).toLocaleDateString('zh-CN')}</div>`;
            item.onclick = () => {
                const editor = content.querySelector('#pages-editor');
                if (editor) {
                    const currentDoc = getCurrentDoc();
                    currentDoc.content = editor.innerHTML;
                    currentDoc.modified = Date.now();
                }
                currentDocId = d.id;
                save(); render();
            };
            listEl.appendChild(item);
        });

        const editor = content.querySelector('#pages-editor');
        editor.oninput = () => {
            doc.content = editor.innerHTML;
            doc.modified = Date.now();
            save();
            updateWordCount();
        };

        function updateWordCount() {
            const text = editor.innerText || '';
            const chars = text.replace(/\s/g, '').length;
            content.querySelector('#pages-wordCount').textContent = `${chars} 字`;
        }
        updateWordCount();

        content.querySelectorAll('.format-btn').forEach(btn => {
            btn.onmousedown = (e) => {
                e.preventDefault();
                document.execCommand(btn.dataset.cmd, false, null);
                editor.focus();
            };
        });

        content.querySelectorAll('.align-btn').forEach(btn => {
            btn.onmousedown = (e) => {
                e.preventDefault();
                document.execCommand('justify' + btn.dataset-align, false, null);
                editor.focus();
            };
        });

        content.querySelectorAll('.list-btn').forEach(btn => {
            btn.onmousedown = (e) => {
                e.preventDefault();
                document.execCommand(btn.dataset.list === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
                editor.focus();
            };
        });

        content.querySelector('#pages-fontSize').onchange = (e) => {
            document.execCommand('fontSize', false, '7');
            const fontElements = editor.getElementsByTagName('font');
            for (let i = 0; i < fontElements.length; i++) {
                if (fontElements[i].size === '7') {
                    fontElements[i].removeAttribute('size');
                    fontElements[i].style.fontSize = e.target.value + 'px';
                }
            }
        };

        content.querySelector('#pages-newDoc').onclick = () => {
            const title = prompt('文稿名称：', '未命名文稿');
            if (title) {
                editor && (doc.content = editor.innerHTML);
                const newDoc = { id: Date.now(), title, content: '<p>开始输入内容...</p>', modified: Date.now() };
                docs.unshift(newDoc);
                currentDocId = newDoc.id;
                save(); render();
            }
        };
    }

    render();
};

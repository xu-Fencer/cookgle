document.addEventListener('DOMContentLoaded', function() {
    // 元素获取
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imageTool = document.getElementById('imageTool');
    const tagInput = document.getElementById('tagInput');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagsList = document.getElementById('tagsList');
    const publishBtn = document.getElementById('publishBtn');
    const tagTool = document.getElementById('tagTool');
    
    // 图片上传功能
    imageTool.addEventListener('click', function() {
        fileInput.click();
    });
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });
    
    // 拖放功能
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = getComputedStyle(root).getPropertyValue('--primary');
        uploadArea.style.backgroundColor = 'rgba(255, 112, 67, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '#e0e0e0';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e0e0e0';
        uploadArea.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // 处理上传的图片
    function handleFiles(files) {
        if (imagePreviewContainer.children.length + files.length > 9) {
            alert('最多只能上传9张图片');
            return;
        }
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (!file.type.match('image.*')) {
                alert('请上传图片文件');
                continue;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'delete-image';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                
                deleteBtn.addEventListener('click', function() {
                    preview.remove();
                });
                
                preview.appendChild(img);
                preview.appendChild(deleteBtn);
                imagePreviewContainer.appendChild(preview);
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // 标签功能
    tagTool.addEventListener('click', function() {
        tagInput.focus();
    });
    
    addTagBtn.addEventListener('click', addTag);
    
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTag();
        }
    });
    
    function addTag() {
        let tagText = tagInput.value.trim();
        
        if (!tagText) return;
        
        // 确保以#开头
        if (!tagText.startsWith('#')) {
            tagText = '#' + tagText;
        }
        
        // 创建标签元素
        const tag = document.createElement('div');
        tag.className = 'tag-item';
        tag.innerHTML = `
            ${tagText}
            <span class="remove-tag"><i class="fas fa-times"></i></span>
        `;
        
        // 添加删除功能
        const removeBtn = tag.querySelector('.remove-tag');
        removeBtn.addEventListener('click', function() {
            tag.remove();
        });
        
        tagsList.appendChild(tag);
        tagInput.value = '';
    }
    
    // 发布功能
    publishBtn.addEventListener('click', function() {
        const textContent = document.querySelector('.editor-textarea').value;
        const images = imagePreviewContainer.querySelectorAll('img');
        const tags = Array.from(tagsList.querySelectorAll('.tag-item')).map(tag => 
            tag.textContent.replace('×', '').trim()
        );
        
        if (!textContent && images.length === 0) {
            alert('请添加文字内容或图片');
            return;
        }
        
        // 构建预览数据
        const previewData = {
            text: textContent,
            imageCount: images.length,
            tags: tags
        };
        
        // 显示成功消息
        alert('分享成功发布！');
        
        // 重置表单
        document.querySelector('.editor-textarea').value = '';
        imagePreviewContainer.innerHTML = '';
        tagsList.innerHTML = '';
    });
});
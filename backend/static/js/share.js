/* share.js - jQuery 实现 */
$(function () {
    /* ---------- 元素缓存 ---------- */
    const $uploadArea            = $('#uploadArea');
    const $fileInput             = $('#fileInput');
    const $imagePreviewContainer = $('#imagePreviewContainer');
    const $imageTool             = $('#imageTool');
    const $tagInput              = $('#tagInput');
    const $addTagBtn             = $('#addTagBtn');
    const $tagsList              = $('#tagsList');
    const $publishBtn            = $('#publishBtn');
    const $tagTool               = $('#tagTool');
    const root                   = document.documentElement; // 用于读取 CSS 变量

    /* ---------- 打开文件选择框 ---------- */
    $imageTool.on('click', () => $fileInput[0].click());
    $uploadArea.on('click', () => $fileInput[0].click());

    /* ---------- 文件选择 ---------- */
    $fileInput.on('change', e => handleFiles(e.target.files));

    /* ---------- 拖放上传 ---------- */
    $uploadArea
        .on('dragover', e => {
            e.preventDefault();
            $uploadArea.css({
                borderColor    : getComputedStyle(root).getPropertyValue('--primary'),
                backgroundColor: 'rgba(255, 112, 67, .1)'
            });
        })
        .on('dragleave', () =>
            $uploadArea.css({ borderColor: '#e0e0e0', backgroundColor: '' })
        )
        .on('drop', e => {
            e.preventDefault();
            $uploadArea.css({ borderColor: '#e0e0e0', backgroundColor: '' });
            if (e.originalEvent.dataTransfer.files.length)
                handleFiles(e.originalEvent.dataTransfer.files);
        });

    /* ---------- 处理文件 ---------- */
    function handleFiles(files) {
        if ($imagePreviewContainer.children().length + files.length > 9) {
            alert('最多只能上传9张图片');
            return;
        }

        $.each(files, (_, file) => {
            if (!file.type.match('image.*')) {
                alert('请上传图片文件');
                return;
            }

            const reader = new FileReader();
            reader.onload = e => {
                const $preview = $('<div>', { class: 'image-preview' });
                const $img     = $('<img>', { src: e.target.result });
                const $delBtn  = $('<div>', {
                    class: 'delete-image',
                    html : '<i class="fas fa-times"></i>'
                });

                /* 删除单张预览 */
                $delBtn.on('click', () => $preview.remove());

                $preview.append($img, $delBtn).appendTo($imagePreviewContainer);
            };
            reader.readAsDataURL(file);
        });
    }

    /* ---------- 标签输入 ---------- */
    $tagTool.on('click', () => $tagInput.focus());
    $addTagBtn.on('click', addTag);
    $tagInput.on('keypress', e => e.key === 'Enter' && addTag());

    function addTag() {
        let text = $.trim($tagInput.val());
        if (!text) return;

        if (!text.startsWith('#')) text = '#' + text;

        const $tag = $(`
            <div class="tag-item">
                ${text}
                <span class="remove-tag"><i class="fas fa-times"></i></span>
            </div>
        `);

        $tag.find('.remove-tag').on('click', () => $tag.remove());

        $tagsList.append($tag);
        $tagInput.val('');
    }

    /* ---------- 发布按钮 ---------- */
    $publishBtn.on('click', () => {
        const textContent = $('.editor-textarea').val();
        const images      = $imagePreviewContainer.find('img');
        const tags        = $tagsList.find('.tag-item').map((_, el) =>
            $(el).text().replace('×', '').trim()
        ).get();

        if (!textContent && !images.length) {
            alert('请添加文字内容或图片');
            return;
        }

        /* 预览数据，可根据需要提交到后端 */
        const preview = {
            text      : textContent,
            imageCount: images.length,
            tags
        };
        console.log('发布数据', preview);

        alert('分享成功发布！');

        /* 重置表单 */
        $('.editor-textarea').val('');
        $imagePreviewContainer.empty();
        $tagsList.empty();
    });
});
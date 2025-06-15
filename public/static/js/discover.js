/* discover.js - jQuery 实现 */
$(function () {
    /* ---------- 历史记录删除 ---------- */
    $('.delete-btn').on('click', function (e) {
        e.stopPropagation();                        // 阻止冒泡
        const $historyItem = $(this).closest('.history-item');
        $historyItem.css('animation', 'fadeOut 0.3s forwards');
        setTimeout(() => $historyItem.remove(), 300);
    });

    /* ---------- 一键清空历史 ---------- */
    $('.clear-history').on('click', function () {
        $('.history-item').each(function () {
            const $item = $(this);
            $item.css('animation', 'fadeOut 0.3s forwards');
            setTimeout(() => $item.remove(), 300);
        });
    });

    /* ---------- 注入 fadeOut 关键帧 ---------- */
    $('<style>', {
        text:
            '@keyframes fadeOut{' +
            'from{opacity:1;transform:translateY(0);}' +
            'to{opacity:0;transform:translateY(-10px);}' +
            '}'
    }).appendTo('head');

    /* ---------- 点击历史记录项 ---------- */
    $('.history-item').on('click', function () {
        const text = $(this).find('.history-text span').text();
        alert('搜索: ' + text);
    });

    /* ---------- 点击热门菜谱 ---------- */
    $('.recipe-item').on('click', function () {
        const title = $(this).find('.recipe-title').text();
        alert('打开菜谱: ' + title);
    });

    /* ---------- 初始淡入动画 ---------- */
    setTimeout(() => {
        $('.recipe-item, .history-item').each(function (idx) {
            $(this).css({
                animation: 'fadeIn 0.5s forwards',
                'animation-delay': `${idx * 0.05}s`
            });
        });
    }, 100);
});
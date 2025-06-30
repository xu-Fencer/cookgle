/* square.js - jQuery 实现 */
$(function () {
    /* ---------- 标签切换 ---------- */
    $('.feed-tab').on('click', function () {
        $('.feed-tab').removeClass('active');
        $(this).addClass('active');
    });

    /* ---------- “加载更多” ---------- */
    $('.load-btn').on('click', function () {
        const $btn      = $(this);
        const $feedGrid = $('.feed-grid');

        /* 动态添加 4 张新卡片 */
        for (let i = 0; i < 4; i++) {
            $('<div>', {
                class: 'feed-card',
                css  : {
                    opacity         : 0,
                    animation       : 'fadeIn 0.5s ease forwards',
                    'animation-delay': `${i * 0.1 + 0.1}s`
                },
                html: `
                    <div class="card-image"><i class="fas fa-image fa-2x"></i></div>
                    <div class="card-info">
                        <div class="card-title"></div>
                        <div class="card-title"></div>
                        <div class="card-user">
                            <div class="user-avatar"><i class="fas fa-user"></i></div>
                            <div class="user-name"></div>
                        </div>
                        <div class="card-stats">
                            <div class="stat-item"></div>
                            <div class="stat-item"></div>
                        </div>
                    </div>
                `
            }).appendTo($feedGrid);
        }

        /* 模拟网络延迟 */
        $btn.html('<i class="fas fa-spinner fa-spin"></i> 加载中...');
        setTimeout(() => $btn.html('加载更多内容'), 1500);
    });

    /* ---------- 卡片轻微缩放点击反馈（事件委托） ---------- */
    $('.feed-grid').on('click', '.feed-card', function () {
        const $card = $(this);
        $card.css('transform', 'scale(0.98)');
        setTimeout(() => $card.css('transform', ''), 200);
    });
});
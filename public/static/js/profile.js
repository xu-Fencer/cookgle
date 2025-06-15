/* profile.js - jQuery 实现 */
$(function () {
    /* ---------- 标签切换 ---------- */
    $('.tab').on('click', function () {
        $('.tab').removeClass('active');
        $('.tab-pane').removeClass('active');

        $(this).addClass('active');
        $('#' + $(this).data('tab')).addClass('active');
    });

    /* ---------- 设置按钮 ---------- */
    $('.settings-btn').on('click', () =>
        alert('打开个人设置页面')
    );

    /* ---------- 动态 / 收藏 点击 ---------- */
    $('.activity-item').on('click', () =>
        alert('打开动态详情')
    );

    $('.collection-item').on('click', function () {
        const title = $(this).find('.collection-title').text();
        alert('打开收藏夹: ' + title);
    });
});
$(document).ready(function() {
    // 获取DOM元素
    const $markAllRead = $('#markAllRead');
    const $notificationItems = $('.notification-item');
    const $notificationTabs = $('.notification-tab');
    const $notificationBadge = $('.notification-badge');

    // 标记全部为已读
    $markAllRead.on('click', function() {
        $notificationItems.removeClass('unread');
        $notificationItems.find('.notification-unread-indicator').hide(); // 隐藏未读指示器

        // 更新未读计数
        $notificationBadge.text('0').hide(); // 设置文本为0并隐藏

        // 显示操作成功提示
        alert('所有消息已标记为已读！');
    });

    // 消息分类标签切换
    $notificationTabs.on('click', function() {
        // 移除所有标签的active状态
        $notificationTabs.removeClass('active');
        // 添加当前标签的active状态
        $(this).addClass('active');

        // 实际应用中这里会有过滤消息的逻辑
        alert('切换到分类: ' + $(this).text());
    });

    // 消息项点击事件
    $notificationItems.on('click', function(e) {
        // 使用 closest() 检查点击的元素是否是 .action-btn 或其子元素
        if (!$(e.target).closest('.action-btn').length) {
            const $thisItem = $(this);
            // 标记为已读
            if ($thisItem.hasClass('unread')) {
                $thisItem.removeClass('unread');
                $thisItem.find('.notification-unread-indicator').hide();

                // 更新未读计数
                let count = parseInt($notificationBadge.text());
                if (count > 0) {
                    count--;
                    $notificationBadge.text(count);
                    if (count === 0) {
                        $notificationBadge.hide();
                    }
                }
            }

            // 实际应用中这里会有跳转到消息详情的逻辑
            alert('打开消息详情');
        }
    });

    // 操作按钮点击事件 (使用事件委托更高效)
    // 注意：这里将事件绑定到 document，并通过选择器过滤，可以处理动态添加的 .action-btn
    $(document).on('click', '.action-btn', function(e) {
        e.stopPropagation(); // 阻止事件冒泡到父元素

        const $thisBtn = $(this);
        const action = $thisBtn.text();
        const message = $thisBtn.closest('.notification-item').find('.notification-desc').text();

        alert(`执行操作: ${action} (${message})`);

        // 特定操作处理
        if (action === '删除') {
            $thisBtn.closest('.notification-item').remove();
            // 如果删除的是未读消息，可能需要更新未读计数
            // 这里未实现此逻辑，因为原始代码也没有，如果需要，可以在这里添加。
        }
    });
});
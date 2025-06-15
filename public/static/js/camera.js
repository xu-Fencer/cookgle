$(document).ready(function() {
    // 相机按钮点击事件
    const $cameraBtn = $('.camera-btn');

    $cameraBtn.on('click', function() {
        // 显示识别中状态
        $cameraBtn.html('<i class="fas fa-spinner fa-spin"></i> 识别中...');
        $cameraBtn.prop('disabled', true);

        // 模拟识别过程
        setTimeout(() => {
            // 随机选择一种食材
            const items = ['胡萝卜', '苹果', '鸡腿', '三文鱼', '芝士', '鸡蛋'];
            const randomItem = items[Math.floor(Math.random() * items.length)];

            alert(`成功识别食材: ${randomItem}! 即将跳转到相关食谱...`);

            // 重置按钮状态
            $cameraBtn.html('<i class="fas fa-camera"></i> 拍摄照片');
            $cameraBtn.prop('disabled', false);
        }, 2000);
    });
});
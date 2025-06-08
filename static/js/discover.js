document.addEventListener('DOMContentLoaded', function() {
    // 为历史记录删除按钮添加事件
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const historyItem = this.closest('.history-item');
            historyItem.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                historyItem.remove();
            }, 300);
        });
    });
    
    // 清空历史记录按钮
    const clearHistoryBtn = document.querySelector('.clear-history');
    clearHistoryBtn.addEventListener('click', function() {
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                item.remove();
            }, 300);
        });
    });
    
    // 为动画添加CSS keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
    
    // 点击历史记录项
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('.history-text span').textContent;
            alert('搜索: ' + text);
        });
    });
    
    // 点击热门菜谱
    const recipeItems = document.querySelectorAll('.recipe-item');
    recipeItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.recipe-title').textContent;
            alert('打开菜谱: ' + title);
        });
    });
    
    // 动画效果 - 延迟显示
    setTimeout(() => {
        document.querySelectorAll('.recipe-item, .history-item').forEach((item, index) => {
            item.style.animation = 'fadeIn 0.5s forwards';
            item.style.animationDelay = `${index * 0.05}s`;
        });
    }, 100);
});
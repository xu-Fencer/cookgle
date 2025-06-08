document.addEventListener('DOMContentLoaded', function() {
    // 标签切换功能
    const tabs = document.querySelectorAll('.feed-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active状态
            tabs.forEach(t => t.classList.remove('active'));
            // 添加当前标签的active状态
            this.classList.add('active');
        });
    });
    
    // 加载更多按钮
    const loadBtn = document.querySelector('.load-btn');
    loadBtn.addEventListener('click', function() {
        // 创建新卡片
        const feedGrid = document.querySelector('.feed-grid');
        
        for (let i = 0; i < 4; i++) {
            const newCard = document.createElement('div');
            newCard.className = 'feed-card';
            newCard.style.opacity = '0';
            newCard.style.animation = 'fadeIn 0.5s ease forwards';
            newCard.style.animationDelay = `${i * 0.1 + 0.1}s`;
            
            newCard.innerHTML = `
                <div class="card-image">
                    <i class="fas fa-image fa-2x"></i>
                </div>
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
            `;
            
            feedGrid.appendChild(newCard);
        }
        
        // 模拟加载延迟
        loadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        setTimeout(() => {
            loadBtn.innerHTML = '加载更多内容';
        }, 1500);
    });
    
    // 卡片点击效果
    const cards = document.querySelectorAll('.feed-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
});
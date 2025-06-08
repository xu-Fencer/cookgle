document.addEventListener('DOMContentLoaded', function() {
    const recommendations = document.getElementById('recommendations');
    const loader = document.getElementById('loader');
    const aiAssistantBtn = document.getElementById('aiAssistantBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const loadedCount = document.getElementById('loadedCount');
    const statusIndicator = document.getElementById('statusIndicator');
    
    let page = 1;
    let lastLoadTime = 0;
    let canLoadMore = true;
    let totalLoaded = 0;
    let cooldownTimer = null;
    
    // 生成智能推荐卡片
    function generateRecommendationCard(data) {
        return `
            <div class="recipe-card" style="animation-delay: ${Math.random() * 0.3}s">
                <div class="recipe-image">
                    <i class="fas fa-${data.icon}"></i>
                    <div class="recipe-badge">${data.category}</div>
                </div>
                <div class="recipe-info">
                    <div class="recipe-title">${data.title}</div>
                    <div class="recipe-meta">
                        <div class="meta-item"><i class="fas fa-fire"></i> ${data.calories}kcal</div>
                        <div class="meta-item"><i class="fas fa-clock"></i> ${data.time}分钟</div>
                        <div class="meta-item"><i class="fas fa-user"></i> ${data.difficulty}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 获取推荐数据
    function getRecommendations() {
        const categories = ["低卡轻食", "热门推荐", "家常菜", "新手友好", "快手菜", "下饭菜"];
        const difficulties = ["简单", "中等", "困难"];
        const icons = ["utensils", "pizza-slice", "hamburger", "fish", "egg", "carrot", "drumstick-bite", "ice-cream"];
        
        const results = [];
        
        // 每次加载4个推荐
        for (let i = 0; i < 4; i++) {
            results.push({
                title: `智能推荐菜谱 #${totalLoaded + i + 1}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                calories: Math.floor(Math.random() * 400) + 200,
                time: Math.floor(Math.random() * 40) + 10,
                difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
                icon: icons[Math.floor(Math.random() * icons.length)]
            });
        }
        
        return results;
    }
    
    // 加载更多推荐
    function loadMoreRecommendations() {
        // 检查是否可以加载（1秒冷却）
        const currentTime = Date.now();
        if (currentTime - lastLoadTime < 1000) {
            return;
        }
        
        // 更新最后加载时间
        lastLoadTime = currentTime;
        
        loader.style.display = 'block';
        statusIndicator.style.display = 'none';
        
        // 模拟网络请求延迟
        setTimeout(() => {
            const newRecommendations = getRecommendations();
            
            newRecommendations.forEach(data => {
                const cardHTML = generateRecommendationCard(data);
                recommendations.innerHTML += cardHTML;
                totalLoaded++;
            });
            
            // 更新加载计数
            loadedCount.textContent = totalLoaded;
            
            loader.style.display = 'none';
            statusIndicator.style.display = 'block';
            
            // 重置动画
            const cards = document.querySelectorAll('.recipe-card');
            cards.forEach(card => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                }, 10);
            });
            
            // 启用节流冷却
            enableCooldown();
        }, 500);
    }
    
    // 启用节流冷却
    function enableCooldown() {
        canLoadMore = false;
        if (cooldownTimer) clearTimeout(cooldownTimer);
        cooldownTimer = setTimeout(() => {
            canLoadMore = true;
        }, 1000);
    }
    
    // 刷新推荐
    function refreshRecommendations() {
        recommendations.innerHTML = '';
        page = 1;
        totalLoaded = 0;
        loadMoreRecommendations();
    }
    
    // 滚动加载更多（带节流）
    function handleScroll() {
        if (!canLoadMore) return;
        
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        // 当滚动到距离底部100px时加载
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMoreRecommendations();
        }
    }
    
    // 初始加载推荐
    refreshRecommendations();
    
    // 事件监听
    window.addEventListener('scroll', handleScroll);
    refreshBtn.addEventListener('click', refreshRecommendations);
    
    aiAssistantBtn.addEventListener('click', function() {
        alert('打开谷鸽AI助手，获取个性化菜谱推荐！');
    });
    
    // 分类点击事件
    const tasteItems = document.querySelectorAll('.taste-item');
    tasteItems.forEach(item => {
        item.addEventListener('click', function() {
            const categoryName = this.querySelector('.taste-name').textContent;
            alert(`打开"${categoryName}"分类页面`);
        });
    });
});
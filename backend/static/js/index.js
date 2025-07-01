/* index.js - jQuery 实现 */
$(function () {
    const $recommendations  = $('#recommendations');
    const $loader           = $('#loader');
    const $aiAssistantBtn   = $('#aiAssistantBtn');
    const $refreshBtn       = $('#refreshBtn');
    const $loadedCount      = $('#loadedCount');
    const $statusIndicator  = $('#statusIndicator');

    let lastLoadTime = 0;       // 上次加载时间戳
    let canLoadMore  = true;    // 节流开关
    let totalLoaded  = 0;       // 已加载总数
    let cooldownTmr  = null;    // 冷却计时器

    function doSearch() {
        var keyword = $('#search-input').val().trim();
        if (keyword) {
            window.location.href = '/search?name=' + encodeURIComponent(keyword);
        }
    }
    $('#search-input').on('keydown', function(e) {
        if (e.key === 'Enter') {
            doSearch();
        }
    });
    $('#search-btn').on('click', function() {
        doSearch();
    });

    /* ---------- 生成推荐卡片 HTML ---------- */
    function generateCard(data) {
        return `
            <div class="recipe-card" style="animation-delay:${Math.random() * 0.3}s">
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

    /* ---------- 伪接口：随机生成推荐数据 ---------- */
    function getRecommendations() {
        const categories   = ['低卡轻食', '热门推荐', '家常菜', '新手友好', '快手菜', '下饭菜'];
        const difficulties = ['简单', '中等', '困难'];
        const icons        = ['utensils', 'pizza-slice', 'hamburger', 'fish', 'egg', 'carrot', 'drumstick-bite', 'ice-cream'];

        return Array.from({ length: 4 }, (_, i) => ({
            title     : `智能推荐菜谱 #${totalLoaded + i + 1}`,
            category  : categories[Math.floor(Math.random() * categories.length)],
            calories  : Math.floor(Math.random() * 400) + 200,
            time      : Math.floor(Math.random() * 40) + 10,
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
            icon      : icons[Math.floor(Math.random() * icons.length)]
        }));
    }

    /* ---------- 加载更多推荐（带 1 s 节流） ---------- */
    function loadMore() {
        const now = Date.now();
        if (now - lastLoadTime < 1000) return;   // 冷却期内不给加载
        lastLoadTime = now;

        $loader.show();
        $statusIndicator.hide();

        setTimeout(() => {
            getRecommendations().forEach(data => {
                $recommendations.append(generateCard(data));
                totalLoaded++;
            });

            $loadedCount.text(totalLoaded);

            $loader.hide();
            $statusIndicator.show();

            /* 重触发每张卡片的 fadeIn 动画 */
            $('.recipe-card').each(function () {
                $(this).css('animation', 'none');
                /* 强制 reflow */
                void this.offsetWidth;
                $(this).css('animation', 'fadeIn 0.5s ease forwards');
            });

            startCooldown();
        }, 500);
    }

    /* ---------- 开始 1 s 冷却 ---------- */
    function startCooldown() {
        canLoadMore = false;
        clearTimeout(cooldownTmr);
        cooldownTmr = setTimeout(() => (canLoadMore = true), 1000);
    }

    /* ---------- 刷新推荐（清空后重新加载） ---------- */
    function refresh() {
        $recommendations.empty();
        totalLoaded = 0;
        loadMore();
    }

    /* ---------- 监听滚动触底 ---------- */
    $(window).on('scroll', function () {
        if (!canLoadMore) return;
        const scrollTop  = $(this).scrollTop();
        const clientH    = $(this).height();
        const docH       = $(document).height();

        if (scrollTop + clientH >= docH - 100) loadMore();
    });

    /* ---------- 初始化 ---------- */
    refresh();
    $refreshBtn.on('click', refresh);

    $aiAssistantBtn.on('click', () =>
        alert('打开谷鸽AI助手，获取个性化菜谱推荐！')
    );

    /* ---------- 分类点击 ---------- */
    $('.taste-item').on('click', function () {
        const name = $(this).find('.taste-name').text();
        alert(`打开"${name}"分类页面`);
    });
});

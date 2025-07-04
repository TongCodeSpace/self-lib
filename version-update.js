/**
 * 版本更新脚本 - 自动更新JavaScript和CSS文件的版本号
 * @author YatingTong
 * @since 2024-01-15
 */

const fs = require('fs');
const path = require('path');

// 生成新的版本号
function generateVersion() {
    const now = new Date();
    return `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}.${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
}

// 更新HTML文件中的版本号
function updateVersionInFile(filePath, newVersion) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 更新 app.js 的版本号
        content = content.replace(
            /app\.js\?v=[\d\.]+/g,
            `app.js?v=${newVersion}`
        );
        
        // 更新 theme.js 的版本号
        content = content.replace(
            /theme\.js\?v=[\d\.]+/g,
            `theme.js?v=${newVersion}`
        );
        
        // 如果没有版本号，添加版本号
        content = content.replace(
            /<script src="app\.js"><\/script>/g,
            `<script src="app.js?v=${newVersion}"></script>`
        );
        
        content = content.replace(
            /<script src="theme\.js"><\/script>/g,
            `<script src="theme.js?v=${newVersion}"></script>`
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已更新 ${filePath} 的版本号到 ${newVersion}`);
    } catch (error) {
        console.error(`❌ 更新 ${filePath} 时出错:`, error.message);
    }
}

// 更新Service Worker的缓存版本
function updateServiceWorkerVersion(newVersion) {
    try {
        let content = fs.readFileSync('sw.js', 'utf8');
        
        // 更新缓存名称
        content = content.replace(
            /const CACHE_NAME = 'reading-records-v\d+';/,
            `const CACHE_NAME = 'reading-records-v${newVersion.replace(/\./g, '')}';`
        );
        
        fs.writeFileSync('sw.js', content, 'utf8');
        console.log(`✅ 已更新 Service Worker 缓存版本到 ${newVersion}`);
    } catch (error) {
        console.error(`❌ 更新 Service Worker 时出错:`, error.message);
    }
}

// 主函数
function main() {
    const newVersion = generateVersion();
    console.log(`🚀 开始更新版本号到: ${newVersion}`);
    
    // 需要更新的HTML文件
    const htmlFiles = [
        'index.html',
        'manage.html',
        'book-detail.html',
        'statistics.html'
    ];
    
    // 更新所有HTML文件
    htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
            updateVersionInFile(file, newVersion);
        }
    });
    
    // 更新Service Worker
    updateServiceWorkerVersion(newVersion);
    
    console.log(`✨ 版本更新完成！当前版本: ${newVersion}`);
    console.log(`💡 提示: 重新启动服务器以应用更改`);
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { generateVersion, updateVersionInFile, updateServiceWorkerVersion }; 
'use client'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <img 
              src="https://raw.githubusercontent.com/liugaoqi666/mrliu-blog/main/public/b_4ffcf0ba9aa55efb99b4180ee1b6190e.jpg" 
              alt="Mr.Liu" 
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white dark:border-gray-800 shadow-xl"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ABOUT THIS SITE
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            关于本站 · 欢迎光临我的小破站
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 mb-8">
          <div className="space-y-6 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              你好呀，欢迎来到我的小网站！本站基于 Next.js + TypeScript + TailwindCSS 构建，
              并使用 Claude 全程 vibe coding 完成。小破站搭建维护不易，还请各路大神不要压制！
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              在这里不光有我的技术文章，偶尔也会在随笔发几句牢骚，分享个人近况，以及一些心得感慨。
              至于画廊，都是本人学生时代闲情逸致的写照，如果你也有相似爱好，非常乐意与你一同分享交流，欢迎留言。
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              也欢迎大家互换友链，可以直接向我发送邮件：
              <a href="mailto:3208613859@qq.com" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">
                3208613859@qq.com
              </a>
              ，也可将你的网站信息发布至留言板。
            </p>
          </div>
        </div>

        {/* Friend Link Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">友链申请信息</h2>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300 sm:w-32 mb-1 sm:mb-0">网站名称</span>
                <span className="text-gray-900 dark:text-white">Mr.LiuのBlog</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300 sm:w-32 mb-1 sm:mb-0">网站头像</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm break-all">https://raw.githubusercontent.com/liugaoqi666/mrliu-blog/main/public/b_4ffcf0ba9aa55efb99b4180ee1b6190e.jpg</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-3">
                <span className="font-medium text-gray-700 dark:text-gray-300 sm:w-32 mb-1 sm:mb-0">网站简介</span>
                <span className="text-gray-900 dark:text-white">爱偷懒的小刘</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">技术栈</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">⚛️</div>
              <p className="font-semibold text-gray-900 dark:text-white">Next.js</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">前端框架</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">📘</div>
              <p className="font-semibold text-gray-900 dark:text-white">TypeScript</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">类型系统</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🎨</div>
              <p className="font-semibold text-gray-900 dark:text-white">TailwindCSS</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">样式框架</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🗄️</div>
              <p className="font-semibold text-gray-900 dark:text-white">MySQL</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">数据库</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">联系方式</h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="mailto:3208613859@qq.com"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">邮箱</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">3208613859@qq.com</p>
              </div>
            </a>
            
            <a
              href="https://github.com/liugaoqi666"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">GitHub</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">liugaoqi666</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

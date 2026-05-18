export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ABOUT THIS SITE · 关于本站</h1>
        <p className="text-xl text-gray-600">欢迎光临我的小破站，感谢你的到来</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="prose prose-lg max-w-none">
          <p>
            你好呀，欢迎来到我的小网站！本站基于 Next.js + TypeScript + TailwindCSS 构建，
            并使用 Claude 全程 vibe coding 完成。小破站搭建维护不易，还请各路大神不要压制！
          </p>

          <p>
            在这里不光有我的技术文章，偶尔也会在随笔发几句牢骚，分享个人近况，以及一些心得感慨。
            至于画廊，都是本人学生时代闲情逸致的写照，如果你也有相似爱好，非常乐意与你一同分享交流，欢迎留言。
          </p>

          <p>
            也欢迎大家互换友链，可以直接向我发送邮件：
            <a href="mailto:3208613859@qq.com" className="text-blue-600 hover:underline">
              3208613859@qq.com
            </a>
            ，也可将你的网站信息发布至留言板。
          </p>

          <h2>友链申请信息</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-medium text-gray-700 w-1/3">网站名称</td>
                  <td className="py-3 text-gray-900">Mr.LiuのBlog</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-medium text-gray-700">网站头像URL</td>
                  <td className="py-3 text-gray-500">https://raw.githubusercontent.com/liugaoqi666/mrliu-blog/main/public/b_4ffcf0ba9aa55efb99b4180ee1b6190e.jpg</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-gray-700">网站简介</td>
                  <td className="py-3 text-gray-900">爱偷懒的小刘</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>技术栈</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-700">Next.js</p>
              <p className="text-sm text-blue-600">前端框架</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-700">TypeScript</p>
              <p className="text-sm text-blue-600">类型系统</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-700">TailwindCSS</p>
              <p className="text-sm text-blue-600">样式框架</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-700">MySQL</p>
              <p className="text-sm text-blue-600">数据库</p>
            </div>
          </div>

          <h2>联系方式</h2>

          <ul>
            <li>
              邮箱：
              <a href="mailto:3208613859@qq.com" className="text-blue-600 hover:underline">
                3208613859@qq.com
              </a>
            </li>
            <li>
              GitHub：
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Mr.Liu
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

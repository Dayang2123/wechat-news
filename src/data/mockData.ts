import { Article, Category } from '../types';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: '如何提高微信公众号的阅读量：10个实用技巧',
    content: '<p>在当今数字化时代，微信公众号已成为企业和个人进行内容营销和品牌建设的重要平台。然而，随着越来越多的公众号涌现，如何提高阅读量成为运营者面临的主要挑战。本文将分享10个实用技巧，帮助你提高微信公众号的阅读量。</p><h2>1. 制定明确的内容定位</h2><p>明确的内容定位有助于吸引特定的目标受众。确定你的公众号要为读者提供什么价值，是分享专业知识、行业动态、生活技巧还是娱乐内容。内容定位越精准，越能吸引真正对你的内容感兴趣的读者。</p>',
    author: '市场营销团队',
    publishDate: '2023-11-15',
    url: 'https://mp.weixin.qq.com/s/example1',
    categoryId: 'marketing',
    isEdited: false,
    spellChecked: false
  },
  {
    id: '2',
    title: 'Python入门：从零开始学习编程',
    content: '<p>Python是一种易于学习且功能强大的编程语言。它拥有高效的高级数据结构，能够简单有效地实现面向对象编程。Python优雅的语法和动态类型，再加上它的解释性质，使它成为许多领域和大多数平台上进行脚本编写和快速应用开发的理想语言。</p><h2>1. 安装Python</h2><p>首先，你需要在你的电脑上安装Python。访问Python官方网站（python.org），下载并安装最新版本的Python。安装过程通常很简单，只需按照安装向导的指示进行操作即可。</p>',
    author: '技术团队',
    publishDate: '2023-10-25',
    url: 'https://mp.weixin.qq.com/s/example2',
    categoryId: 'tech',
    isEdited: true,
    lastEdited: '2023-12-01',
    spellChecked: true
  },
  {
    id: '3',
    title: 'UI设计趋势：2023年必知的设计动向',
    content: '<p>随着技术的不断发展和用户需求的变化，UI设计也在不断演变。2023年，我们看到了一些令人兴奋的设计趋势，它们正在重塑我们对数字界面的体验和感知。本文将探讨今年最重要的UI设计趋势，以及它们如何影响你的设计工作。</p><h2>1. 暗色模式的普及</h2><p>暗色模式（Dark Mode）已不再是一个新概念，但它在2023年变得更加普及。越来越多的应用和网站默认提供暗色模式选项，不仅因为它可以减少屏幕亮度、节省电池寿命，还因为许多用户在低光环境下更喜欢这种视觉体验。</p>',
    author: '设计团队',
    publishDate: '2023-09-10',
    url: 'https://mp.weixin.qq.com/s/example3',
    categoryId: 'design',
    isEdited: false,
    spellChecked: false
  },
  {
    id: '4',
    title: '机器学习入门：概念、算法与应用',
    content: '<p>机器学习是人工智能的一个分支，它专注于开发能够从数据中学习并进行预测的算法。本文将介绍机器学习的基本概念、常用算法以及实际应用场景，帮助读者建立对这一领域的基本认识。</p><h2>1. 什么是机器学习？</h2><p>机器学习是一种让计算机系统能够通过经验自动改进的方法。它涉及开发能够访问数据并使用数据来学习的计算机程序。学习的过程始于观察或数据，如直接经验或指导，以便寻找数据中的模式并根据这些经验做出更好的决策。</p>',
    author: '技术团队',
    publishDate: '2023-08-05',
    url: 'https://mp.weixin.qq.com/s/example4',
    categoryId: 'tech',
    isEdited: true,
    lastEdited: '2023-09-01',
    spellChecked: true
  },
  {
    id: '5',
    title: '品牌建设策略：如何打造一个成功的品牌',
    content: '<p>品牌是企业最宝贵的资产之一。一个强大的品牌可以为企业带来竞争优势、顾客忠诚度以及更高的利润。但是，打造一个成功的品牌需要深思熟虑的策略和持续的努力。本文将探讨品牌建设的关键策略，帮助你打造一个与众不同、令人难忘的品牌。</p><h2>1. 定义你的品牌定位</h2><p>品牌定位是指你的品牌在目标市场中相对于竞争对手的位置。它涉及到你的品牌承诺、价值主张以及你希望在顾客心中建立的形象。清晰的品牌定位有助于引导所有的营销活动，确保品牌信息的一致性。</p>',
    author: '市场营销团队',
    publishDate: '2023-07-20',
    url: 'https://mp.weixin.qq.com/s/example5',
    categoryId: 'marketing',
    isEdited: false,
    spellChecked: false
  }
];

export const mockCategories: Category[] = [
  {
    id: 'tech',
    name: '技术',
    description: '技术相关的文章，包括编程、机器学习等',
    order: 1,
    articleCount: 2,
    color: '#4299E1' // blue
  },
  {
    id: 'marketing',
    name: '营销',
    description: '市场营销相关的文章',
    order: 2,
    articleCount: 2,
    color: '#48BB78' // green
  },
  {
    id: 'design',
    name: '设计',
    description: 'UI设计、用户体验设计相关的文章',
    order: 3,
    articleCount: 1,
    color: '#ED8936' // orange
  },
  {
    id: 'uncategorized',
    name: '未分类',
    description: '尚未分类的文章',
    order: 4,
    articleCount: 0,
    color: '#A0AEC0' // gray
  }
];
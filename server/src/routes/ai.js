const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')
const { validateAiQuestion } = require('../utils/validate')
const { requireUgcEligible } = require('../utils/newUserGuard')
const { aiChatLimiter } = require('../middleware/writeRateLimit')

// AI回答模板库
const aiResponses = {
  cat: {
    food: `🐱 **猫咪饮食指南**

**主食推荐：**
- 优质猫粮（干粮/湿粮）：选择蛋白质含量>30%的猫粮
- 建议品牌：皇家、渴望、爱肯拿等

**喂食频率：**
- 幼猫（<6月龄）：每天4-5次
- 成年猫：每天2-3次
- 老年猫：每天3-4次

**注意事项：**
⚠️ 不能喂食：巧克力、葡萄、洋葱、大蒜、生鸡蛋
✅ 适量补充：化毛膏、营养膏、鱼油

**每日食量参考：**
- 体重3kg：约50-60g干粮
- 体重5kg：约70-80g干粮`,
    
    health: `🐱 **猫咪健康护理**

**日常观察：**
- 精神状态：是否活泼好动
- 食欲变化：突然不吃饭要警惕
- 排泄情况：尿量、便便形态

**疫苗接种：**
- 2月龄：猫三联第一针
- 3月龄：猫三联第二针+狂犬疫苗
- 之后每年加强一次

**驱虫计划：**
- 体内驱虫：每3个月一次
- 体外驱虫：每月一次

**常见疾病信号：**
🔴 频繁呕吐 → 可能肠胃问题
🔴 频繁上厕所 → 可能泌尿系统问题
🔴 眼睛分泌物多 → 可能呼吸道感染`,

    behavior: `🐱 **猫咪行为解读**

**猫咪叫声含义：**
- 短促的"喵"：打招呼
- 拉长的"喵~"：有需求
- 咕噜声：满足/放松
- 嘶嘶声：害怕/警告

**肢体语言：**
- 尾巴竖起：开心、友好
- 尾巴炸毛：害怕/攻击
- 露肚皮：信任你（但不一定想被摸）
- 慢眨眼：表达爱意

**常见行为问题：**
1. 乱抓家具 → 准备足够的猫抓板
2. 夜间吵闹 → 睡前陪玩消耗精力
3. 不用猫砂盆 → 检查猫砂盆位置和清洁度`,

    default: `🐱 **猫咪养护小贴士**

作为一只猫咪的铲屎官，你需要关注：
1. **饮食**：选择优质猫粮，定时定量喂食
2. **健康**：定期体检、疫苗和驱虫
3. **环境**：提供猫爬架、猫抓板等
4. **互动**：每天陪玩15-30分钟

有什么具体问题想了解吗？可以问我：
- 猫咪吃什么好？
- 猫咪怎么驱虫？
- 猫咪行为什么意思？`
  },

  dog: {
    food: `🐶 **狗狗饮食指南**

**主食推荐：**
- 优质狗粮：选择适合狗狗体型和年龄的配方
- 建议品牌：皇家、比瑞吉、渴望等

**喂食频率：**
- 幼犬（<6月龄）：每天3-4次
- 成年犬：每天2次
- 老年犬：每天2-3次

**禁止喂食：**
⛔ 巧克力、葡萄、洋葱
⛔ 鸡骨头（容易刺伤）
⛔ 高盐高糖食物

**每日食量参考：**
- 小型犬（<10kg）：约100-200g
- 中型犬（10-25kg）：约200-400g
- 大型犬（>25kg）：约400-600g`,

    health: `🐶 **狗狗健康护理**

**疫苗计划：**
- 6-8周：第一针联苗
- 10-12周：第二针联苗
- 14-16周：第三针联苗+狂犬
- 之后每年加强一次

**驱虫计划：**
- 体内驱虫：每3个月一次
- 体外驱虫：每月一次（夏天更重要）

**日常护理：**
- 每周刷牙2-3次
- 定期清理耳朵
- 每1-2周洗澡一次
- 定期修剪指甲

**异常信号：**
🔴 不吃东西超过24小时
🔴 持续呕吐或腹泻
🔴 精神萎靡、不爱动`,

    training: `🐶 **狗狗训练技巧**

**基础训练顺序：**
1. 坐下（Sit）
2. 等待（Stay）
3. 过来（Come）
4. 趴下（Down）

**训练原则：**
✅ 及时奖励：做对立刻给零食
✅ 短时多次：每次5-10分钟
✅ 耐心一致：全家人指令统一
❌ 不要打骂：会破坏信任关系

**纠正坏习惯：**
1. 乱叫 → 找原因，适当忽略
2. 扑人 → 转身不理，安静后再互动
3. 乱咬 → 提供磨牙玩具，制止后转移注意力`,

    default: `🐶 **狗狗养护小贴士**

养狗需要注意：
1. **饮食**：定时定量，选对狗粮
2. **运动**：每天遛狗1-2小时
3. **训练**：从小培养好习惯
4. **健康**：定期体检和疫苗

有什么具体问题想了解吗？可以问我：
- 狗狗吃什么好？
- 怎么训练狗狗？
- 狗狗怎么驱虫？`
  },

  default: {
    default: `🐾 **宠物养护助手**

你好！我是AI养宠助手，可以帮你解答宠物相关问题。

**我可以帮你：**
- 🍽️ 宠物饮食建议
- 🏥 健康护理指导
- 🎓 训练技巧分享
- 💡 行为问题解答

**使用方法：**
- 直接输入你的问题
- 或者选择下方快捷问题

请问你想了解什么？`
  }
}

// 快捷问题关键词匹配
function matchQuestion(question, petType) {
  const q = question.toLowerCase()
  
  // 饮食相关
  if (q.includes('吃') || q.includes('食物') || q.includes('粮') || q.includes('喂') || q.includes('饮食')) {
    return 'food'
  }
  
  // 健康相关
  if (q.includes('健康') || q.includes('病') || q.includes('医') || q.includes('疫苗') || q.includes('驱虫') || q.includes('生病')) {
    return 'health'
  }
  
  // 训练相关
  if (q.includes('训练') || q.includes('教') || q.includes('听话') || q.includes('规矩')) {
    return 'training'
  }
  
  // 行为相关
  if (q.includes('行为') || q.includes('叫') || q.includes('咬') || q.includes('抓') || q.includes('习惯')) {
    return 'behavior'
  }
  
  return 'default'
}

/**
 * AI对话
 */
router.post('/chat', auth, requireUgcEligible, aiChatLimiter, async (req, res) => {
  const { question, pet_id } = req.body

  const questionErr = validateAiQuestion(question)
  if (questionErr) {
    return res.status(400).json(error(questionErr, 400))
  }

  try {
    // 确定宠物类型
    let petType = 'default'
    if (pet_id) {
      const pets = await query('SELECT type FROM pets WHERE id = ? AND user_id = ?', [pet_id, req.user.id])
      if (pets.length > 0) {
        petType = pets[0].type
      }
    } else {
      // 尝试从问题中识别宠物类型
      const q = question.toLowerCase()
      if (q.includes('猫') || q.includes('咪')) {
        petType = 'cat'
      } else if (q.includes('狗') || q.includes('犬') || q.includes('汪')) {
        petType = 'dog'
      }
    }

    // 匹配问题类型
    const questionType = matchQuestion(question, petType)
    
    // 获取回答
    const responses = aiResponses[petType] || aiResponses.default
    const answer = responses[questionType] || responses.default

    // 保存对话记录
    const result = await query(
      'INSERT INTO ai_chats (user_id, question, answer, pet_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [req.user.id, question.trim(), answer, pet_id || null]
    )

    res.json(success({ 
      answer,
      id: result.insertId,
      pet_type: petType,
      question_type: questionType
    }, '获取成功'))
  } catch (err) {
    console.error('AI对话失败:', err)
    res.status(500).json(error('获取回答失败', 500))
  }
})

/**
 * 获取AI对话历史
 */
router.get('/history', auth, async (req, res) => {
  const { page = 1, size = 20 } = req.query
  const offset = (page - 1) * size

  try {
    const history = await query(
      'SELECT * FROM ai_chats WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.user.id, parseInt(size), parseInt(offset)]
    )

    const total = await query(
      'SELECT COUNT(*) as count FROM ai_chats WHERE user_id = ?',
      [req.user.id]
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: history,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取对话历史失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 删除对话记录
 */
router.delete('/history/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const result = await query(
      'DELETE FROM ai_chats WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json(error('记录不存在', 404))
    }

    res.json(success(null, '删除成功'))
  } catch (err) {
    console.error('删除对话记录失败:', err)
    res.status(500).json(error('删除失败', 500))
  }
})

/**
 * 清空对话历史
 */
router.delete('/history', auth, async (req, res) => {
  try {
    await query('DELETE FROM ai_chats WHERE user_id = ?', [req.user.id])

    res.json(success(null, '清空成功'))
  } catch (err) {
    console.error('清空对话历史失败:', err)
    res.status(500).json(error('清空失败', 500))
  }
})

/**
 * 获取快捷问题
 */
router.get('/quick-questions', auth, async (req, res) => {
  const questions = [
    { text: '猫咪应该吃什么？', category: 'cat' },
    { text: '狗狗怎么训练？', category: 'dog' },
    { text: '宠物疫苗什么时候打？', category: 'health' },
    { text: '宠物驱虫多久一次？', category: 'health' },
    { text: '猫咪为什么乱抓家具？', category: 'cat' },
    { text: '狗狗为什么乱叫？', category: 'dog' }
  ]

  res.json(success(questions, '获取成功'))
})

module.exports = router

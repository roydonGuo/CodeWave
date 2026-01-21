// 数据类型定义
export interface CodeSegment {
  type: 'code';
  lang: string;
  raw: string;
  summary: string;
  label: string;
}

export interface TextSegment {
  type: 'text';
  content: string;
}

export type Segment = CodeSegment | TextSegment;

export interface Article {
  id: number;
  title: string;
  author: string;
  duration: string;
  category: string;
  segments: Segment[];
  createTime?: string; // 创建时间（可选，用于从后端获取的数据）
}

// Mock 数据
export const MOCK_LIBRARY: Article[] = [
  {
    id: 1,
    title: "React Hooks 深度性能优化指南",
    author: "Dan A.",
    duration: "12:40",
    category: "Frontend",
    segments: [
      { type: 'text', content: "在现代 React 开发中，useMemo 和 useCallback 是优化渲染性能的两个重要钩子。很多开发者存在误用，导致适得其反。" },
      { type: 'text', content: "让我们来看一个典型的性能瓶颈场景：父组件仅仅因为状态更新，导致昂贵的子组件重复渲染。" },
      { 
        type: 'code', 
        lang: 'javascript',
        raw: `const Parent = () => {
  const [count, setCount] = useState(0);
  // 错误：每次渲染都会创建新函数引用
  const handleClick = () => console.log('Clicked');
  
  return <ExpensiveChild onClick={handleClick} />;
};`,
        summary: "这段代码展示了一个反模式：在父组件中定义普通箭头函数 handleClick，导致每次渲染时函数引用发生变化，进而触发 ExpensiveChild 的无意义重渲染。",
        label: "JavaScript 代码块：父组件中的函数引用问题示例" 
      },
      { type: 'text', content: "为了解决这个问题，我们需要使用 useCallback 来包裹该函数，确保引用稳定性。" },
      {
        type: 'code',
        lang: 'javascript',
        raw: `const handleClick = useCallback(() => {
  console.log('Clicked');
}, []); // 依赖数组为空，函数引用永久保持不变`,
        summary: "修复后的代码：使用了 useCallback 钩子包裹回调函数，依赖数组为空，确保了函数引用的稳定性。",
        label: "JavaScript 代码块：使用 useCallback 的正确实现"
      },
      { type: 'text', content: "只要依赖项数组没有变化，React 就会复用上一次的函数实例，从而配合 React.memo 避免子组件重渲染。" }
    ]
  },
  {
    id: 2,
    title: "Rust 所有权机制图解",
    author: "Steve K.",
    duration: "18:20",
    category: "System",
    segments: [
      { type: 'text', content: "Rust 的核心特性就是所有权。它让 Rust 无需垃圾回收即可保证内存安全。" },
      { type: 'text', content: "所有权系统有三个核心规则：每个值都有一个所有者；同一时间只能有一个所有者；当所有者离开作用域时，值会被丢弃。" },
      { 
        type: 'code', 
        lang: 'rust', 
        raw: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 被移动到了 s2
    // println!("{}, world!", s1); // 错误：s1 已失效
}`, 
        summary: "这段代码演示了 Rust 的所有权转移（Move）语义。当 s1 赋值给 s2 时，s1 的所有权被移交，原变量失效，防止了二次释放错误。", 
        label: "Rust 代码块：所有权移动示例" 
      },
      { type: 'text', content: "理解 Move 语义是掌握 Rust 的第一步。这与 Java 或 Go 的引用复制完全不同。" },
      { type: 'text', content: "当我们需要在不转移所有权的情况下使用值时，可以使用引用。引用分为可变引用和不可变引用，Rust 的借用检查器会确保引用安全。" },
      {
        type: 'code',
        lang: 'rust',
        raw: `fn calculate_length(s: &String) -> usize {
    s.len() // 借用，不获取所有权
}

let s = String::from("hello");
let len = calculate_length(&s);
println!("{} 的长度是 {}", s, len); // s 仍然有效`,
        summary: "这段代码展示了 Rust 的借用机制。通过使用引用 &String，函数可以访问值而不获取所有权，调用后原变量仍然有效。",
        label: "Rust 代码块：借用示例"
      },
      { type: 'text', content: "借用规则确保了内存安全：同一时间可以有多个不可变引用，或者只能有一个可变引用，但不能同时存在。" }
    ]
  },
  {
    id: 3,
    title: "微服务架构中的分布式事务",
    author: "Sam N.",
    duration: "24:15",
    category: "Architecture",
    segments: [
      { type: 'text', content: "在微服务架构下，由于数据库被拆分，传统的 ACID 事务无法跨服务使用。我们需要引入 Saga 模式。" },
      { type: 'text', content: "Saga 模式通过一系列本地事务来模拟全局事务，如果某个步骤失败，则执行补偿操作。" },
      { type: 'text', content: "Saga 有两种实现方式：编排式（Choreography）和编排式（Orchestration）。编排式由各个服务自主协调，编排式则由一个中央协调器统一管理。" },
      { 
        type: 'code', 
        lang: 'yaml', 
        raw: `saga:
  - step: OrderService.createOrder
    compensation: OrderService.cancelOrder
  - step: PaymentService.processPayment
    compensation: PaymentService.refundPayment`, 
        summary: "这是一个 Saga 事务流程的伪代码描述。定义了订单创建和支付处理的正向操作，以及对应的取消订单和退款的补偿操作。", 
        label: "YAML 配置：Saga 事务编排" 
      },
      { type: 'text', content: "补偿操作必须是幂等的，因为可能被多次调用。同时，补偿操作本身也可能失败，需要设计重试机制。" },
      { type: 'text', content: "在实际应用中，可以使用消息队列来保证 Saga 的可靠性，确保每个步骤都能被正确执行或补偿。" }
    ]
  },
  {
    id: 4,
    title: "Kubernetes Pod 生命周期管理",
    author: "Brendan B.",
    duration: "15:05",
    category: "DevOps",
    segments: [
      { type: 'text', content: "Pod 是 K8s 中的最小调度单元。了解 Pod 的生命周期对于排查 CrashLoopBackOff 错误至关重要。" },
      { type: 'text', content: "Pod 的生命周期包括以下几个阶段：Pending、Running、Succeeded、Failed、Unknown。每个阶段都反映了 Pod 的不同状态。" },
      {
        type: 'code',
        lang: 'yaml',
        raw: `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: app
    image: nginx:latest
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10`,
        summary: "这是一个 Pod 配置示例，展示了如何定义容器和健康检查。livenessProbe 用于检测容器是否存活，如果检查失败，K8s 会重启容器。",
        label: "YAML 配置：Pod 定义和健康检查"
      },
      { type: 'text', content: "健康检查包括三种类型：livenessProbe 检测容器是否存活，readinessProbe 检测容器是否就绪，startupProbe 检测容器是否启动完成。" },
      { type: 'text', content: "当 Pod 出现问题时，可以通过 kubectl describe pod 和 kubectl logs 命令来诊断问题，查看事件和日志信息。" }
    ]
  },
  {
    id: 5,
    title: "TypeScript 高级类型系统实战",
    author: "Ryan F.",
    duration: "22:30",
    category: "Frontend",
    segments: [
      { type: 'text', content: "TypeScript 的类型系统是它最强大的特性之一。掌握高级类型可以帮助我们编写更安全、更灵活的代码。" },
      { type: 'text', content: "条件类型（Conditional Types）允许我们根据类型关系来选择类型。这是构建复杂类型工具的基础。" },
      {
        type: 'code',
        lang: 'typescript',
        raw: `type NonNullable<T> = T extends null | undefined ? never : T;

type Example1 = NonNullable<string | null>; // string
type Example2 = NonNullable<number | undefined>; // number`,
        summary: "这是一个条件类型的示例。NonNullable 类型工具可以移除类型中的 null 和 undefined，如果类型是 null 或 undefined，则返回 never，否则返回原类型。",
        label: "TypeScript 代码块：条件类型示例"
      },
      { type: 'text', content: "映射类型（Mapped Types）允许我们基于旧类型创建新类型。我们可以遍历类型的属性并转换它们。" },
      {
        type: 'code',
        lang: 'typescript',
        raw: `type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>; // 所有属性变为只读`,
        summary: "这个示例展示了映射类型的用法。Readonly 工具类型可以将对象的所有属性变为只读，通过遍历所有键并添加 readonly 修饰符实现。",
        label: "TypeScript 代码块：映射类型示例"
      },
      { type: 'text', content: "工具类型如 Partial、Required、Pick、Omit 等都是基于这些高级类型特性构建的，理解它们的实现原理有助于更好地使用 TypeScript。" }
    ]
  },
  {
    id: 6,
    title: "Docker 容器网络深度解析",
    author: "Alex M.",
    duration: "19:45",
    category: "DevOps",
    segments: [
      { type: 'text', content: "Docker 网络是容器化应用通信的基础。理解不同的网络模式对于构建分布式应用至关重要。" },
      { type: 'text', content: "Docker 提供了多种网络模式：bridge、host、none、overlay 等。每种模式都有其适用场景。" },
      {
        type: 'code',
        lang: 'bash',
        raw: `# 创建自定义网络
docker network create my-network

# 运行容器并连接到网络
docker run -d --name app1 --network my-network nginx
docker run -d --name app2 --network my-network nginx

# 容器可以通过容器名互相访问
docker exec app1 ping app2`,
        summary: "这个示例展示了如何创建 Docker 网络并连接容器。在同一网络中的容器可以通过容器名进行通信，Docker 会自动进行 DNS 解析。",
        label: "Bash 命令：Docker 网络创建和使用"
      },
      { type: 'text', content: "bridge 网络是默认网络模式，适合单主机上的容器通信。overlay 网络则用于跨主机的容器通信，常用于 Docker Swarm 或 Kubernetes 环境。" },
      { type: 'text', content: "网络隔离是 Docker 安全的重要方面。不同网络的容器默认无法通信，这提供了良好的安全边界。" }
    ]
  },
  {
    id: 7,
    title: "GraphQL API 设计最佳实践",
    author: "Lee B.",
    duration: "16:20",
    category: "Architecture",
    segments: [
      { type: 'text', content: "GraphQL 提供了一种更灵活、更高效的数据查询方式。但设计良好的 GraphQL API 需要遵循一些最佳实践。" },
      { type: 'text', content: "首先，要合理设计 Schema。使用描述性的类型名称，避免深层嵌套，保持查询的扁平化。" },
      {
        type: 'code',
        lang: 'graphql',
        raw: `type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type Query {
  user(id: ID!): User
  posts(limit: Int, offset: Int): [Post!]!
}`,
        summary: "这是一个 GraphQL Schema 示例，展示了如何定义类型和查询。使用非空类型（!）可以明确哪些字段是必需的，提高 API 的清晰度。",
        label: "GraphQL Schema：类型定义示例"
      },
      { type: 'text', content: "实现 DataLoader 模式可以解决 N+1 查询问题。通过批量加载和缓存，显著提高查询性能。" },
      { type: 'text', content: "使用分页而不是返回所有数据，使用字段级别的权限控制，这些都是构建生产级 GraphQL API 的关键考虑。" }
    ]
  },
  {
    id: 8,
    title: "Vue 3 Composition API 核心原理",
    author: "Evan Y.",
    duration: "14:50",
    category: "Frontend",
    segments: [
      { type: 'text', content: "Vue 3 的 Composition API 提供了更灵活的逻辑复用方式。理解其核心原理有助于编写更好的 Vue 应用。" },
      { type: 'text', content: "Composition API 的核心是 setup 函数。它返回的对象会暴露给模板和组件的其他选项。" },
      {
        type: 'code',
        lang: 'javascript',
        raw: `import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    
    const increment = () => {
      count.value++;
    };
    
    onMounted(() => {
      console.log('Component mounted');
    });
    
    return {
      count,
      doubleCount,
      increment
    };
  }
}`,
        summary: "这个示例展示了 Composition API 的基本用法。使用 ref 创建响应式数据，computed 创建计算属性，onMounted 处理生命周期钩子。",
        label: "JavaScript 代码块：Vue 3 Composition API 示例"
      },
      { type: 'text', content: "ref 和 reactive 的区别在于：ref 可以包装任何类型的值，访问时需要 .value；reactive 只能包装对象，可以直接访问属性。" },
      { type: 'text', content: "Composition API 的最大优势是逻辑复用。通过组合式函数（Composables），我们可以轻松地在多个组件间共享逻辑。" }
    ]
  },
  {
    id: 9,
    title: "Redis 缓存策略与性能优化",
    author: "Salvatore S.",
    duration: "20:15",
    category: "System",
    segments: [
      { type: 'text', content: "Redis 是高性能的内存数据库，广泛应用于缓存场景。合理的缓存策略可以显著提升应用性能。" },
      { type: 'text', content: "常见的缓存策略包括：Cache-Aside、Read-Through、Write-Through、Write-Behind 等。每种策略都有其适用场景。" },
      {
        type: 'code',
        lang: 'python',
        raw: `import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0)

def get_user(user_id):
    # Cache-Aside 模式
    cache_key = f"user:{user_id}"
    cached = r.get(cache_key)
    
    if cached:
        return json.loads(cached)
    
    # 缓存未命中，从数据库加载
    user = db.get_user(user_id)
    if user:
        r.setex(cache_key, 3600, json.dumps(user))
    
    return user`,
        summary: "这段代码展示了 Cache-Aside 模式的实现。应用先检查缓存，如果未命中则从数据库加载，并将结果写入缓存。这是最常用的缓存模式。",
        label: "Python 代码块：Cache-Aside 模式实现"
      },
      { type: 'text', content: "缓存失效是缓存设计的核心问题。需要考虑过期时间、主动失效、缓存穿透、缓存雪崩等问题。" },
      { type: 'text', content: "Redis 的数据结构选择也很重要。String 适合简单键值，Hash 适合对象，List 适合队列，Set 适合去重，Sorted Set 适合排行榜。" }
    ]
  },
  {
    id: 10,
    title: "Webpack 5 模块联邦实战",
    author: "Tobias K.",
    duration: "17:30",
    category: "Frontend",
    segments: [
      { type: 'text', content: "Webpack 5 的模块联邦（Module Federation）允许在运行时动态加载远程模块，实现微前端架构。" },
      { type: 'text', content: "模块联邦的核心是共享依赖和远程模块。通过配置，不同的应用可以共享代码，减少重复打包。" },
      {
        type: 'code',
        lang: 'javascript',
        raw: `// webpack.config.js
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remoteApp: 'remote@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};`,
        summary: "这是模块联邦的配置示例。host 应用可以加载 remote 应用的模块，同时共享 React 和 React-DOM，避免重复加载。",
        label: "JavaScript 配置：Webpack 模块联邦配置"
      },
      { type: 'text', content: "使用模块联邦时，需要注意版本兼容性。shared 配置中的 singleton 选项确保只加载一个版本的依赖。" },
      { type: 'text', content: "模块联邦适合大型应用拆分，但也要考虑网络延迟、错误处理、版本管理等实际生产问题。" }
    ]
  },
  {
    id: 11,
    title: "PostgreSQL 查询优化技巧",
    author: "Bruce M.",
    duration: "21:40",
    category: "System",
    segments: [
      { type: 'text', content: "PostgreSQL 是功能强大的关系型数据库。掌握查询优化技巧可以显著提升应用性能。" },
      { type: 'text', content: "索引是查询优化的基础。理解 B-tree、Hash、GiST、GIN 等索引类型的适用场景很重要。" },
      {
        type: 'code',
        lang: 'sql',
        raw: `-- 创建索引
CREATE INDEX idx_user_email ON users(email);

-- 分析查询计划
EXPLAIN ANALYZE 
SELECT * FROM users WHERE email = 'user@example.com';

-- 复合索引
CREATE INDEX idx_user_name_email ON users(name, email);`,
        summary: "这些 SQL 语句展示了索引的创建和使用。EXPLAIN ANALYZE 可以查看查询的执行计划，帮助识别性能瓶颈。复合索引可以优化多列查询。",
        label: "SQL 语句：索引创建和查询分析"
      },
      { type: 'text', content: "查询优化还包括：避免 SELECT *，使用 LIMIT，合理使用 JOIN，避免在 WHERE 子句中使用函数等。" },
      { type: 'text', content: "PostgreSQL 的 VACUUM 和 ANALYZE 命令可以清理死元组和更新统计信息，定期运行这些命令有助于保持数据库性能。" }
    ]
  },
  {
    id: 12,
    title: "Node.js 事件循环机制详解",
    author: "Ryan D.",
    duration: "18:55",
    category: "System",
    segments: [
      { type: 'text', content: "Node.js 的事件循环是其异步编程的核心。理解事件循环的工作机制对于编写高性能 Node.js 应用至关重要。" },
      { type: 'text', content: "事件循环包含多个阶段：timers、pending callbacks、idle、poll、check、close callbacks。每个阶段都有特定的任务。" },
      {
        type: 'code',
        lang: 'javascript',
        raw: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1, 4, 3, 2`,
        summary: "这个示例展示了事件循环的执行顺序。同步代码先执行，然后微任务（Promise）执行，最后是宏任务（setTimeout）。理解这个顺序对于调试异步代码很重要。",
        label: "JavaScript 代码块：事件循环执行顺序示例"
      },
      { type: 'text', content: "process.nextTick 的优先级最高，会在当前阶段完成后立即执行。Promise 的 then 回调属于微任务，会在宏任务之前执行。" },
      { type: 'text', content: "理解事件循环有助于避免阻塞主线程，合理使用异步操作，编写更高效的 Node.js 代码。" }
    ]
  },
  {
    id: 13,
    title: "MongoDB 聚合管道高级用法",
    author: "Eliot H.",
    duration: "23:10",
    category: "System",
    segments: [
      { type: 'text', content: "MongoDB 的聚合管道提供了强大的数据转换和分析能力。掌握高级用法可以处理复杂的查询需求。" },
      { type: 'text', content: "聚合管道由多个阶段组成，每个阶段对文档进行转换。常用阶段包括 $match、$group、$sort、$project 等。" },
      {
        type: 'code',
        lang: 'javascript',
        raw: `db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: {
    _id: '$customerId',
    totalAmount: { $sum: '$amount' },
    orderCount: { $sum: 1 }
  }},
  { $sort: { totalAmount: -1 } },
  { $limit: 10 }
])`,
        summary: "这个聚合管道示例展示了如何筛选已完成的订单，按客户分组统计总金额和订单数，然后按总金额降序排列，最后取前10条。这是典型的数据分析场景。",
        label: "MongoDB 聚合：订单统计分析示例"
      },
      { type: 'text', content: "$lookup 阶段可以实现类似 SQL JOIN 的操作，$unwind 可以展开数组字段，$facet 可以并行执行多个管道。" },
      { type: 'text', content: "聚合管道的性能优化包括：尽早使用 $match 过滤数据，合理使用索引，避免在 $group 前进行大量数据转换。" }
    ]
  },
  {
    id: 14,
    title: "Elasticsearch 全文搜索优化",
    author: "Shay B.",
    duration: "19:25",
    category: "System",
    segments: [
      { type: 'text', content: "Elasticsearch 是强大的全文搜索引擎。优化搜索性能需要理解其索引和查询机制。" },
      { type: 'text', content: "分析器（Analyzer）是全文搜索的核心。它负责将文本转换为可搜索的词条。选择合适的分析器很重要。" },
      {
        type: 'code',
        lang: 'json',
        raw: `{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "stop", "snowball"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "my_analyzer"
      }
    }
  }
}`,
        summary: "这是 Elasticsearch 的索引配置示例。自定义分析器包含标准分词器、小写转换、停用词过滤和词干提取，可以优化中文和英文的搜索效果。",
        label: "JSON 配置：Elasticsearch 索引配置示例"
      },
      { type: 'text', content: "查询优化包括：使用 bool 查询组合多个条件，使用 filter 而不是 query 进行精确匹配，合理使用聚合查询等。" },
      { type: 'text', content: "分片和副本的配置也很重要。过多的分片会增加开销，过少则影响性能。需要根据数据量和查询模式来平衡。" }
    ]
  }
];


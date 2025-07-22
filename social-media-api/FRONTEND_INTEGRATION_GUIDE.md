# 🚀 دليل ربط الفرونت إند - Social Media API

## 📋 نظرة عامة

تم تحسين وتطوير API ليكون مثالياً للربط مع تطبيقات الفرونت إند. يحتوي على **60 مستخدم، 200 منشور، وبيانات تحليلية شاملة**.

### 🌐 معلومات الاتصال
- **GraphQL Endpoint**: `http://localhost:4000/graphql`
- **Auth REST API**: `http://localhost:4000/auth`
- **قاعدة البيانات**: MongoDB مع بيانات حقيقية
- **المصادقة**: JWT Token

---

## 🔑 المصادقة والبدء

### 1. تسجيل الدخول
```javascript
// POST http://localhost:4000/auth/login
const response = await fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user1@example.com',
    password: 'password123'
  })
});

const { token, user } = await response.json();
// احفظ التوكن للاستخدام في GraphQL
```

### 2. استخدام التوكن في GraphQL
```javascript
const graphqlQuery = {
  query: `
    query GetAllPosts {
      allPosts(limit: 10) {
        posts {
          id
          content
          platform
          likes
          createdBy {
            username
            avatar
          }
        }
        total
        hasMore
      }
    }
  `
};

const response = await fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(graphqlQuery)
});
```

---

## 📝 استعلامات المنشورات (Posts Queries)

### أ) جميع المنشورات مع فلترة متقدمة
```graphql
query GetAllPosts($filter: PostFilterInput, $sort: PostSortInput, $limit: Int, $skip: Int) {
  allPosts(filter: $filter, sort: $sort, limit: $limit, skip: $skip) {
    posts {
      id
      contentId
      platform
      contentType
      content
      author
      hashtags
      location
      status
      visibility
      metrics {
        likes
        comments
        shares
        views
        saves
        clicks
      }
      engagement {
        rate
        score
      }
      createdBy {
        id
        username
        email
        avatar
        isVerified
        location
      }
      createdAt
      publishedAt
    }
    total
    hasMore
    nextCursor
  }
}
```

**متغيرات:**
```json
{
  "filter": {
    "platform": "INSTAGRAM",
    "contentType": "POST",
    "likes": { "gte": 100 },
    "createdAt": {
      "gte": "2024-01-01T00:00:00.000Z",
      "lte": "2024-12-31T23:59:59.999Z"
    },
    "hashtags": ["#تطوير", "#برمجة"]
  },
  "sort": {
    "field": "LIKES",
    "order": "DESC"
  },
  "limit": 20,
  "skip": 0
}
```

### ب) منشور واحد بالتفاصيل
```graphql
query GetPost($id: ID!) {
  post(id: $id) {
    id
    contentId
    platform
    contentType
    content
    author
    hashtags
    mentions
    location
    language
    status
    visibility
    metrics {
      likes
      comments
      shares
      views
      saves
      clicks
    }
    engagement {
      rate
      score
    }
    createdBy {
      id
      username
      email
      avatar
      isVerified
      bio
      followersCount
      followingCount
    }
    analytics {
      id
      analyticsType
      metrics {
        reach
        impressions
        engagement
        clicks
      }
      snapshotDate
    }
    scheduledAt
    publishedAt
    createdAt
    updatedAt
  }
}
```

### ج) منشوراتي الشخصية
```graphql
query GetMyPosts($filter: PostFilterInput, $sort: PostSortInput, $limit: Int) {
  myPosts(filter: $filter, sort: $sort, limit: $limit) {
    posts {
      id
      content
      platform
      contentType
      status
      visibility
      metrics {
        likes
        views
        comments
      }
      createdAt
    }
    total
    hasMore
  }
}
```

### د) البحث في المنشورات
```graphql
query SearchPosts($query: String!, $filter: PostFilterInput, $limit: Int) {
  searchPosts(query: $query, filter: $filter, limit: $limit) {
    posts {
      id
      content
      platform
      author
      hashtags
      metrics {
        likes
        views
      }
      createdBy {
        username
        avatar
      }
    }
    total
    hasMore
  }
}
```

---

## ✏️ إضافة وتعديل المنشورات (Mutations)

### أ) إضافة منشور جديد
```graphql
mutation AddPost($input: PostInput!) {
  addPost(input: $input) {
    id
    contentId
    platform
    contentType
    content
    author
    hashtags
    status
    visibility
    metrics {
      likes
      comments
      shares
      views
    }
    createdBy {
      username
      avatar
    }
    createdAt
  }
}
```

**متغيرات:**
```json
{
  "input": {
    "platform": "TWITTER",
    "contentType": "TWEET",
    "content": "منشور جديد رائع! 🚀 #تطوير #React #GraphQL",
    "hashtags": ["#تطوير", "#React", "#GraphQL"],
    "mentions": ["@username"],
    "location": "الرياض",
    "visibility": "PUBLIC"
  }
}
```

### ب) تحديث منشور
```graphql
mutation UpdatePost($id: ID!, $input: PostUpdateInput!) {
  updatePost(id: $id, input: $input) {
    id
    content
    status
    visibility
    updatedAt
  }
}
```

### ج) حذف منشور
```graphql
mutation DeletePost($id: ID!) {
  deletePost(id: $id)
}
```

### د) تفاعلات المنشورات
```graphql
# إعجاب
mutation LikePost($postId: ID!) {
  likePost(postId: $postId) {
    id
    metrics {
      likes
    }
  }
}

# مشاركة
mutation SharePost($postId: ID!) {
  sharePost(postId: $postId) {
    id
    metrics {
      shares
    }
  }
}
```

---

## 👤 استعلامات المستخدمين

### أ) الملف الشخصي الحالي
```graphql
query GetMe {
  me {
    id
    username
    email
    bio
    avatar
    isVerified
    followersCount
    followingCount
    postsCount
    location
    website
    joinedDate
    posts(limit: 5) {
      id
      content
      platform
      metrics {
        likes
        views
      }
    }
  }
}
```

### ب) ملف مستخدم آخر
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    username
    bio
    avatar
    isVerified
    followersCount
    followingCount
    postsCount
    location
    website
    posts(limit: 10) {
      id
      content
      platform
      likes
      createdAt
    }
  }
}
```

### ج) تحديث الملف الشخصي
```graphql
mutation UpdateProfile($input: UserUpdateInput!) {
  updateProfile(input: $input) {
    id
    username
    bio
    avatar
    location
    website
  }
}
```

---

## 📊 التحليلات والإحصائيات

### أ) تحليلات المحتوى
```graphql
query GetContentAnalytics($contentId: String!) {
  analyticsByContent(contentId: $contentId) {
    id
    analyticsType
    platform
    periodType
    metrics {
      reach
      impressions
      engagement
      clicks
      likes
      comments
      shares
      saves
      profileVisits
      websiteClicks
    }
    demographics {
      ageGroups {
        range
        percentage
      }
      genders {
        type
        percentage
      }
      locations {
        country
        percentage
      }
    }
    snapshotDate
  }
}
```

### ب) تحليلات المنصة
```graphql
query GetPlatformAnalytics($platform: Platform!, $filter: AnalyticsFilterInput) {
  analyticsByPlatform(platform: $platform, filter: $filter) {
    snapshots {
      id
      contentId
      analyticsType
      metrics {
        reach
        impressions
        engagement
      }
      snapshotDate
    }
    total
    summary {
      totalReach
      totalImpressions
      totalEngagement
      averageEngagementRate
      topPerformingPlatform
      topPerformingContentType
    }
  }
}
```

### ج) إحصائيات المستخدم
```graphql
query GetUserStats($userId: ID) {
  userStats(userId: $userId) {
    totalPosts
    totalLikes
    totalViews
    totalComments
    totalShares
    averageEngagementRate
    topPlatforms {
      platform
      postsCount
      totalLikes
      totalViews
      averageEngagement
    }
    growthRate
  }
}
```

### د) إحصائيات عامة
```graphql
query GetOverallStats {
  platformStats {
    platform
    postsCount
    totalLikes
    totalViews
    averageEngagement
  }
  
  contentTypeStats {
    contentType
    postsCount
    totalEngagement
    averageEngagementRate
  }
}
```

---

## 🎯 أمثلة للفرونت إند

### React.js Example
```jsx
import { useState, useEffect } from 'react';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchPosts = async () => {
    const query = {
      query: `
        query GetAllPosts {
          allPosts(limit: 20, sort: {field: CREATED_AT, order: DESC}) {
            posts {
              id
              content
              platform
              createdAt
              metrics {
                likes
                comments
                views
              }
              createdBy {
                username
                avatar
                isVerified
              }
            }
            hasMore
          }
        }
      `
    };

    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(query)
      });

      const result = await response.json();
      setPosts(result.data.allPosts.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="posts-list">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <img src={post.createdBy.avatar} alt={post.createdBy.username} />
            <span>{post.createdBy.username}</span>
            {post.createdBy.isVerified && <span>✓</span>}
          </div>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          <div className="post-metrics">
            <span>👍 {post.metrics.likes}</span>
            <span>💬 {post.metrics.comments}</span>
            <span>👁️ {post.metrics.views}</span>
          </div>
          <div className="post-platform">
            Platform: {post.platform}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
```

### Vue.js Example
```vue
<template>
  <div class="dashboard">
    <div class="stats-cards">
      <div class="stat-card" v-for="stat in userStats.topPlatforms" :key="stat.platform">
        <h3>{{ stat.platform }}</h3>
        <p>{{ stat.postsCount }} منشور</p>
        <p>{{ stat.totalLikes }} إعجاب</p>
      </div>
    </div>

    <div class="posts-grid">
      <PostCard 
        v-for="post in posts" 
        :key="post.id" 
        :post="post"
        @like="likePost"
        @share="sharePost"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import PostCard from './PostCard.vue';

export default {
  name: 'Dashboard',
  components: { PostCard },
  setup() {
    const posts = ref([]);
    const userStats = ref({});
    const token = ref(localStorage.getItem('token'));

    const fetchData = async () => {
      const query = {
        query: `
          query GetDashboardData {
            myPosts(limit: 20) {
              posts {
                id
                content
                platform
                metrics { likes, comments, views }
                createdAt
              }
            }
            userStats {
              topPlatforms {
                platform
                postsCount
                totalLikes
              }
            }
          }
        `
      };

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify(query)
      });

      const result = await response.json();
      posts.value = result.data.myPosts.posts;
      userStats.value = result.data.userStats;
    };

    const likePost = async (postId) => {
      const mutation = {
        query: `
          mutation LikePost($postId: ID!) {
            likePost(postId: $postId) {
              id
              metrics { likes }
            }
          }
        `,
        variables: { postId }
      };

      await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify(mutation)
      });

      fetchData(); // Refresh data
    };

    onMounted(fetchData);

    return {
      posts,
      userStats,
      likePost,
      sharePost: (postId) => console.log('Share post:', postId)
    };
  }
};
</script>
```

---

## 🔧 إعدادات متقدمة للفرونت إند

### Apollo Client Setup (React)
```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### GraphQL Queries Organization
```javascript
// queries/posts.js
import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  query GetAllPosts($filter: PostFilterInput, $sort: PostSortInput, $limit: Int, $skip: Int) {
    allPosts(filter: $filter, sort: $sort, limit: $limit, skip: $skip) {
      posts {
        id
        content
        platform
        metrics { likes, comments, views }
        createdBy { username, avatar, isVerified }
        createdAt
      }
      total
      hasMore
      nextCursor
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($input: PostInput!) {
    addPost(input: $input) {
      id
      content
      platform
      createdAt
    }
  }
`;
```

---

## 🎨 UI Components Examples

### Post Card Component
```jsx
const PostCard = ({ post, onLike, onShare }) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <img 
          src={post.createdBy.avatar || '/default-avatar.png'} 
          alt={post.createdBy.username}
          className="avatar"
        />
        <div className="user-info">
          <span className="username">
            {post.createdBy.username}
            {post.createdBy.isVerified && <span className="verified">✓</span>}
          </span>
          <span className="platform">{post.platform}</span>
        </div>
        <span className="timestamp">
          {formatDate(post.createdAt)}
        </span>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
        {post.hashtags && (
          <div className="hashtags">
            {post.hashtags.map(tag => (
              <span key={tag} className="hashtag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="post-actions">
        <button onClick={() => onLike(post.id)} className="like-btn">
          👍 {post.metrics.likes}
        </button>
        <button onClick={() => onShare(post.id)} className="share-btn">
          🔄 {post.metrics.shares}
        </button>
        <span className="views">👁️ {post.metrics.views}</span>
      </div>
    </div>
  );
};
```

---

## 📱 مميزات الـ API للفرونت إند

### ✅ **مميزات متقدمة:**
- **Pagination** مع `hasMore` و `nextCursor`
- **Real-time updates** (Subscriptions جاهزة)
- **Advanced filtering** بجميع الحقول
- **Search functionality** في المحتوى والمؤلفين
- **Rich analytics** مع Demographics
- **File upload ready** للصور والملفات
- **Bulk operations** للعمليات المتعددة

### 📊 **Dashboard Analytics:**
- إحصائيات شاملة لكل مستخدم
- توزيع المنصات والمحتوى
- معدلات التفاعل والنمو
- تحليل الجمهور الديموغرافي

### 🔒 **الأمان:**
- JWT Authentication
- Authorization على مستوى الحقول
- Data validation شامل
- Rate limiting جاهز للتطبيق

---

## 🎯 **البيانات المتاحة للاختبار:**

### 👥 **المستخدمين**: 60 مستخدم
- أسماء عربية حقيقية
- بيانات شخصية متنوعة
- مستخدمين محققين (%20)

### 📝 **المنشورات**: 200 منشور
- محتوى عربي واقعي
- 7 منصات مختلفة
- 6 أنواع محتوى
- Hashtags وإحصائيات

### 📊 **Analytics**: متوفرة لجميع المنشورات
- تحليلات يومية/أسبوعية/شهرية
- Demographics كاملة
- معدلات تفاعل واقعية

---

🎉 **API جاهز للربط مع أي تطبيق فرونت إند!**

للمساعدة أو الاستفسارات، تحقق من:
- GraphQL Playground: http://localhost:4000/graphql
- دليل الـ Endpoints: `ENDPOINTS_GUIDE.md`
- أمثلة Postman: `test-endpoints.ps1` 
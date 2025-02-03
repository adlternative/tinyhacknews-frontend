# Stage 1: 构建阶段
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制所有源代码
COPY . .

# 构建生产版本
RUN npm run build

# Stage 2: 生产阶段
FROM nginx:stable-alpine

# 复制构建好的静态文件到 Nginx 的默认目录
COPY --from=build /app/dist /usr/share/nginx/html

# 可选：复制自定义的 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口（默认是80）
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
# 一键部署到 VPS

本项目使用 [Kamal](https://kamal-deploy.org/) 实现一键部署到 VPS。

## 前置准备

### 1. 本地环境

确保已安装：
- Docker Desktop（用于构建镜像）
- GitHub CLI：`brew install gh`

### 2. GitHub Token

创建 GitHub Personal Access Token：
1. 访问：https://github.com/settings/tokens/new
2. 勾选权限：`write:packages` 和 `read:packages`
3. 生成 token 并保存

认证方式（选择其一）：
```bash
# 方式 1: 使用 GitHub CLI（推荐）
gh auth login

# 方式 2: 设置环境变量
export GITHUB_TOKEN=your_token_here
```

### 3. VPS 配置

确保你的 VPS (178.104.58.157) 满足：
- 已安装 Docker
- SSH 密钥认证已配置（可以无密码 SSH 登录）
- 防火墙开放 80 和 443 端口

#### 首次设置 VPS

如果 VPS 还没有安装 Docker，运行：
```bash
bin/kamal server bootstrap
```

这会自动在服务器上安装 Docker。

### 4. DNS 配置

将域名 `zuozizhen.com` 的 A 记录指向：`178.104.58.157`

## 一键部署

### 首次部署

```bash
bin/deploy
```

首次部署会：
1. 构建 Docker 镜像
2. 推送到 GitHub Container Registry
3. 在 VPS 上拉取镜像
4. 启动应用容器
5. 配置 Traefik 反向代理
6. 自动申请 Let's Encrypt SSL 证书

### 后续更新

每次代码更新后，只需运行：
```bash
bin/deploy
```

Kamal 会自动进行零停机部署。

## 常用命令

```bash
# 查看实时日志
bin/kamal app logs -f

# 进入 Rails console
bin/kamal console

# 进入容器 shell
bin/kamal app exec bash

# 查看应用状态
bin/kamal app details

# 重启应用
bin/kamal app restart

# 回滚到上一版本
bin/kamal rollback

# 查看所有可用命令
bin/kamal help
```

## 故障排查

### 部署失败

```bash
# 查看详细日志
bin/kamal app logs

# 检查服务器状态
bin/kamal server details

# 重新部署
bin/kamal deploy --skip-push  # 跳过镜像构建，直接部署
```

### SSL 证书问题

确保：
1. DNS 已正确配置并生效
2. 防火墙开放 80 和 443 端口
3. 域名可以从外网访问

### SSH 连接问题

```bash
# 测试 SSH 连接
ssh root@178.104.58.157

# 如果需要使用非 root 用户，在 config/deploy.yml 中配置：
# ssh:
#   user: your_username
```

## 配置文件说明

- `config/deploy.yml` - Kamal 主配置文件
- `.kamal/secrets` - 敏感信息配置（不要提交到 git）
- `Dockerfile` - Docker 镜像构建配置

## 环境变量

如需添加环境变量，编辑 `config/deploy.yml`：

```yaml
env:
  secret:
    - RAILS_MASTER_KEY
    - MY_SECRET_KEY  # 添加新的密钥
  clear:
    MY_PUBLIC_VAR: "value"  # 添加公开变量
```

然后在 `.kamal/secrets` 中定义：
```bash
MY_SECRET_KEY=$(cat path/to/secret)
```

## 数据持久化

SQLite 数据库和上传文件存储在 Docker volume 中：
- Volume 名称：`zuozizhen_storage`
- 挂载路径：`/rails/storage`

备份数据：
```bash
bin/kamal app exec "tar czf /tmp/backup.tar.gz /rails/storage"
bin/kamal app exec "cat /tmp/backup.tar.gz" > backup.tar.gz
```

## 监控和维护

### 查看资源使用

```bash
ssh root@178.104.58.157 "docker stats"
```

### 清理旧镜像

```bash
bin/kamal prune all
```

## 安全建议

1. ✅ 使用 SSH 密钥认证（不要用密码）
2. ✅ 定期更新服务器系统：`ssh root@178.104.58.157 "apt update && apt upgrade"`
3. ✅ 配置防火墙只开放必要端口
4. ✅ 定期备份数据
5. ✅ 不要将 `config/master.key` 提交到 git

## 成本优化

如果使用多个应用，可以共享同一个 Traefik 代理：
```yaml
proxy:
  ssl: true
  host: zuozizhen.com
  # 多个应用可以共享同一个代理
```

## 更多资源

- [Kamal 官方文档](https://kamal-deploy.org/)
- [Kamal GitHub](https://github.com/basecamp/kamal)
- [Rails 部署指南](https://guides.rubyonrails.org/deploying.html)

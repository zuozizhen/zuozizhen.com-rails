# GitHub Actions 自动部署配置

## 设置步骤

### 1. 添加 GitHub Secrets

在你的 GitHub 仓库设置中添加以下 secrets：
https://github.com/zuozizhen/zuozizhen/settings/secrets/actions

需要添加的 secrets：

#### SSH_PRIVATE_KEY
你的 SSH 私钥，用于连接 VPS。

获取方式：
```bash
cat ~/.ssh/id_rsa
```

如果没有，先生成：
```bash
ssh-keygen -t ed25519 -C "github-actions"
cat ~/.ssh/id_ed25519
```

然后将公钥添加到 VPS：
```bash
ssh-copy-id root@178.104.58.157
```

#### SSH_KNOWN_HOSTS
VPS 的 SSH 指纹。

获取方式：
```bash
ssh-keyscan 178.104.58.157
```

#### RAILS_MASTER_KEY
Rails 加密凭证的密钥。

获取方式：
```bash
cat config/master.key
```

#### GITHUB_TOKEN
GitHub Actions 会自动提供 `GITHUB_TOKEN`，但它的权限可能不够。

你需要创建一个 Personal Access Token：
1. 访问：https://github.com/settings/tokens/new
2. 勾选：`write:packages`, `read:packages`
3. 生成后，添加为 secret（名称：`GHCR_TOKEN`）

然后修改 workflow 文件中的：
```yaml
GITHUB_TOKEN: ${{ secrets.GHCR_TOKEN }}
```

### 2. 推送代码

配置完成后，每次推送到 main 分支：
```bash
git add .
git commit -m "Update"
git push origin main
```

GitHub Actions 会自动：
1. ✅ 检出代码
2. ✅ 设置 Ruby 环境
3. ✅ 构建 Docker 镜像
4. ✅ 推送到 GitHub Container Registry
5. ✅ SSH 到 VPS 部署
6. ✅ 零停机更新

### 3. 查看部署状态

访问：https://github.com/zuozizhen/zuozizhen/actions

可以看到每次部署的日志和状态。

## 方案 2：Webhook（备选）

如果不想用 GitHub Actions，也可以在 VPS 上设置 webhook 监听 GitHub push 事件。

## 本地手动部署

如果需要手动部署（不触发自动部署），仍然可以运行：
```bash
bin/deploy
```

## 注意事项

1. **首次部署**仍需手动执行 `bin/kamal server bootstrap` 来安装 Docker
2. **SSH 密钥**必须配置正确，GitHub Actions 才能连接到 VPS
3. **RAILS_MASTER_KEY** 非常重要，不要泄露
4. 建议在 Actions 中添加通知（Slack、邮件等）

## 故障排查

如果 Actions 失败：
1. 检查 Secrets 是否配置正确
2. 查看 Actions 日志
3. 确认 SSH 连接正常：`ssh root@178.104.58.157`
4. 确认 Docker 已安装：`ssh root@178.104.58.157 "docker --version"`

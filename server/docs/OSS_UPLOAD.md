# 文件上传（阿里云 OSS）

逻辑对齐 `logistics-system` 的 `MiniController.updateFileOss` + `AliOssUtil`：

- 对象名：`UUID + 原文件后缀`
- 返回：`https://{bucket}.{endpoint}/{objectName}`

## 环境变量（`server/.env`）

从 logistics 项目的 `sky.alioss` 复制到本项目的 OSS 变量：

| logistics (`sky.alioss`) | pet-community |
|--------------------------|---------------|
| `access-key-id` | `OSS_ACCESS_KEY_ID` |
| `access-key-secret` | `OSS_ACCESS_KEY_SECRET` |
| `bucket-name` | `OSS_BUCKET_NAME` |
| `endpoint` | `OSS_ENDPOINT` |
| `region` | `OSS_REGION` |

可选：

- `OSS_KEY_PREFIX=pet-community/` — OSS 目录前缀
- `OSS_ENABLED=true` — 显式启用（未配置密钥时自动回退本地 `uploads/`）

## API

| 接口 | 说明 |
|------|------|
| `POST /api/file/updateFileOss` | 小程序通用上传，`multipart` 字段名 `file`，需登录，返回 `data` 为 URL 字符串 |
| `POST /api/user/avatar` | 用户头像，字段名 `avatar` |
| `POST /api/admin/upload` | 管理后台，字段名 `file` |

## 小程序

发布动态、添加宠物保存前会调用 `uploadFileToOss`，将本地临时路径换成 OSS URL 再写入数据库。

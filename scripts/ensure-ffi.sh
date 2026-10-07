#!/bin/bash
# ============================================================
# 兜底安装 cn-font-split 的 libffi 原生库（Linux x86_64）
#
# 背景：
#   cn-font-split 的 postinstall 依赖 ungh.cc 查询最新版本号，
#   在部分构建环境（如腾讯云 ESA）访问 ungh.cc 不稳定时版本号为空、
#   下载 404，导致 astro build 阶段 FFI 加载失败（ERR_FFI）。
#
# ⚠️ 安全说明（重要）：
#   这个脚本会下载一个**原生共享库**并在构建期由 cn-font-split 通过 FFI 加载，
#   等于在构建机上执行未经审计的原生代码。因此：
#     1. 版本号写死，不再运行时联网查询（查询结果可被中间人篡改）；
#     2. 强制 HTTPS；
#     3. 下载后**必须**通过 SHA256 校验，校验不通过就删除并退出；
#     4. 没配置哈希时默认**拒绝下载**（fail-closed）。
#
# 如何拿到哈希：
#   curl -fsSL -o libffi.so "<下面的 URL>" && sha256sum libffi.so
#
# 如何使用：
#   在 CI/CD 里设置环境变量 CN_FONT_SPLIT_LIBFFI_SHA256=<哈希> 后正常构建。
#   实在无法校验又必须构建时，可设 CN_FONT_SPLIT_ALLOW_UNVERIFIED=1 强制跳过，
#   但这等于信任网络传输 —— 请自己权衡。
# ============================================================
set -euo pipefail

TARGET="libffi-x86_64-unknown-linux-gnu.so"
VERSION="7.6.8"
URL="https://github.com/KonghaYao/cn-font-split/releases/download/${VERSION}/${TARGET}"

EXPECTED_SHA256="${CN_FONT_SPLIT_LIBFFI_SHA256:-}"
ALLOW_UNVERIFIED="${CN_FONT_SPLIT_ALLOW_UNVERIFIED:-}"

DIST_DIR=$(find node_modules -type d -path "*cn-font-split/dist" 2>/dev/null | head -1)

if [ -z "$DIST_DIR" ]; then
  echo "[ensure-ffi] 未在 node_modules 中找到 cn-font-split，跳过"
  exit 0
fi

FILE="$DIST_DIR/$TARGET"
if [ -f "$FILE" ]; then
  echo "[ensure-ffi] $TARGET 已存在，跳过"
  exit 0
fi

if [ -z "$EXPECTED_SHA256" ] && [ "$ALLOW_UNVERIFIED" != "1" ]; then
  echo "[ensure-ffi] 错误：未配置 CN_FONT_SPLIT_LIBFFI_SHA256，拒绝下载未校验的原生库。" >&2
  echo "[ensure-ffi] 取哈希：curl -fsSL -o libffi.so \"$URL\" && sha256sum libffi.so" >&2
  echo "[ensure-ffi] 若确认要跳过校验：export CN_FONT_SPLIT_ALLOW_UNVERIFIED=1" >&2
  exit 1
fi

echo "[ensure-ffi] 下载 $TARGET（版本 $VERSION）"
mkdir -p "$DIST_DIR"
curl -fsSL --proto '=https' --tlsv1.2 --max-time 120 -o "$FILE" "$URL"

if [ -n "$EXPECTED_SHA256" ]; then
  ACTUAL_SHA256=$(sha256sum "$FILE" | awk '{print $1}')
  if [ "$ACTUAL_SHA256" != "$EXPECTED_SHA256" ]; then
    echo "[ensure-ffi] 错误：SHA256 校验失败，已删除下载文件。" >&2
    echo "[ensure-ffi]   期望：$EXPECTED_SHA256" >&2
    echo "[ensure-ffi]   实际：$ACTUAL_SHA256" >&2
    rm -f "$FILE"
    exit 1
  fi
  echo "[ensure-ffi] SHA256 校验通过"
else
  echo "[ensure-ffi] ⚠️ 已跳过 SHA256 校验（CN_FONT_SPLIT_ALLOW_UNVERIFIED=1）" >&2
fi

ls -l "$FILE"
echo "[ensure-ffi] 完成"

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
实用工具模块
提供一些常用的工具函数
"""

import os
import sys
from typing import List, Dict, Any

def greet(name: str = "World") -> str:
    """
    问候函数

    Args:
        name: 要问候的名字

    Returns:
        问候字符串
    """
    return f"Hello, {name}! 👋"

def get_file_info(filepath: str) -> Dict[str, Any]:
    """
    获取文件信息

    Args:
        filepath: 文件路径

    Returns:
        包含文件信息的字典
    """
    if not os.path.exists(filepath):
        return {"error": "文件不存在"}

    stat = os.stat(filepath)
    return {
        "name": os.path.basename(filepath),
        "size": stat.st_size,
        "modified": stat.st_mtime,
        "is_file": os.path.isfile(filepath),
        "is_dir": os.path.isdir(filepath)
    }

def fibonacci(n: int) -> List[int]:
    """
    生成斐波那契数列

    Args:
        n: 要生成的数字个数

    Returns:
        斐波那契数列
    """
    if n <= 0:
        return []
    elif n == 1:
        return [0]

    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib

if __name__ == "__main__":
    # 测试代码
    print(greet("GitHub"))
    print(f"斐波那契数列前10项: {fibonacci(10)}")
    print(f"当前文件信息: {get_file_info(__file__)}")
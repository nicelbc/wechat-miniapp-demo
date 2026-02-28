#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试工具模块
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from utils import greet, fibonacci, get_file_info

def test_greet():
    """测试问候函数"""
    assert greet() == "Hello, World! 👋"
    assert greet("GitHub") == "Hello, GitHub! 👋"
    print("✅ test_greet passed")

def test_fibonacci():
    """测试斐波那契数列"""
    assert fibonacci(0) == []
    assert fibonacci(1) == [0]
    assert fibonacci(2) == [0, 1]
    assert fibonacci(5) == [0, 1, 1, 2, 3]
    assert fibonacci(10) == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    print("✅ test_fibonacci passed")

def test_get_file_info():
    """测试文件信息获取"""
    info = get_file_info(__file__)
    assert info["name"] == "test_utils.py"
    assert info["is_file"] == True
    assert info["is_dir"] == False
    print("✅ test_get_file_info passed")

if __name__ == "__main__":
    print("运行测试...")
    test_greet()
    test_fibonacci()
    test_get_file_info()
    print("🎉 所有测试通过！")
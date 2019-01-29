"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class root {
}
class FastScanner {
    /**
     * 初始化
     * @param words 敏感词数组
     */
    constructor(words) {
        this.root = this.buildTree(words);
    }
    /**
     * 构建敏感词
     * @param words 敏感词
     */
    buildTree(words) {
        words = this.dedupAndSort(words);
        const root = {
            next: {},
            val: null,
            back: null,
            parent: null,
            accept: null
        };
        for (let i = 0; i < words.length; i++) {
            this.addWord(root, words[i]);
        }
        this.fallbackAll(root);
        return root;
    }
    /**
     * 词汇去重复
     * @param words 敏感词
     */
    dedupAndSort(words) {
        //去除空格
        words = words.map(word => {
            return word.trim();
        });
        //过滤掉空字符串
        words = words.filter(word => {
            return word.length > 0;
        });
        let seen = [];
        let out = [];
        words.forEach(word => {
            if (!seen[word]) {
                seen[word] = true;
                out[out.length] = word;
            }
        });
        return out.sort();
    }
    /**
     * 添加词汇
     * @param root
     * @param word
     */
    addWord(root, word) {
        let current = root;
        for (let i = 0; i < word.length; i++) {
            const c = word[i];
            const next = current.next[c];
            if (!next) {
                current.next[c] = {
                    next: {},
                    val: c,
                    accept: false,
                    back: root,
                    parent: current
                };
            }
            current = current.next[c];
        }
        current.accept = true;
    }
    /**
     *
     * @param root
     */
    fallbackAll(root) {
        let curExpands = Object.values(root.next);
        while (curExpands.length > 0) {
            const nextExpands = [];
            for (let i = 0; i < curExpands.length; i++) {
                let node = curExpands[i];
                for (let c in node.next) {
                    nextExpands.push(node.next[c]);
                }
                let parent = node.parent;
                let back = parent.back;
                while (back != null) {
                    var child = back.next[node.val];
                    if (child) {
                        node.back = child;
                        break;
                    }
                    back = back.back;
                }
            }
            curExpands = nextExpands;
        }
    }
    /**
     * 查询匹配的词汇以及所在字符串的位置
     * @param content 需要进行匹配的内容
     * @param options quick=true 只选第一个词，longest=true 位置相同，返回最长的词
     */
    search(content, options) {
        let offWords = [];
        let current = this.root;
        options = options || {};
        for (let i = 0; i < content.length; i++) {
            let c = content[i];
            let next = current.next[c];
            if (!next) {
                // 当前分支上找不到，跳到其它分支上找
                let back = current.back;
                while (back != null) {
                    next = back.next[c];
                    if (next) {
                        break;
                    }
                    back = back.back;
                }
            }
            if (next) {
                let back = next;
                do {
                    // 收集匹配的词汇
                    if (back.accept) {
                        let word = this.collect(back);
                        offWords.push([i - word.length + 1, word]);
                        // 只选第一个词
                        if (options.quick) {
                            return offWords;
                        }
                    }
                    back = back.back;
                } while (back != this.root);
                current = next;
                continue;
            }
            // 重置
            current = this.root;
        }
        // 同一个位置选最长的
        if (options.longest) {
            return this.selectLongest(offWords);
        }
        return offWords;
    }
    // 从子节点往上直到根结点，收集单词
    collect(node) {
        let word = [];
        while (node.val != null) {
            word.unshift(node.val);
            node = node.parent;
        }
        return word.join("");
    }
    selectLongest(offsetWords) {
        var stands = {};
        for (let i = 0; i < offsetWords.length; i++) {
            let offword = offsetWords[i];
            let word = stands[offword[0]];
            if (!word || word.length < offword[1].length) {
                stands[offword[0]] = offword[1];
            }
        }
        var offsets = Object.keys(stands)
            .map(function (key) {
            return parseInt(key);
        })
            .sort(function (a, b) {
            return a - b;
        });
        return offsets.map(function (off) {
            return [off, stands[off]];
        });
    }
    /**
     *  匹配关键词命中次数
     * @param content 需要进行匹配的内容
     * @param options quick=true 只选第一个词，longest=true 位置相同，返回最长的词
     */
    hits(content, options) {
        let offWords = this.search(content, options);
        let seen = {};
        let result = {
            code: false,
            seen: seen
        };
        for (let i = 0; i < offWords.length; i++) {
            let word = offWords[i][1];
            let count = seen[word] || 0;
            seen[word] = count + 1;
        }
        if (!this.isEmptyObject(seen)) {
            result.code = true;
            result.seen = seen;
        }
        return result;
    }
    /**
     * 判断对象是否为空
     * @param obj
     */
    isEmptyObject(obj) {
        for (const key in obj) {
            if (key) {
                return false;
            }
        }
        return true;
    }
}
exports.default = FastScanner;
//# sourceMappingURL=index.js.map
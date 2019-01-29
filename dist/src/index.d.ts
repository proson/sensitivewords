export default class FastScanner {
    private root;
    /**
     * 初始化
     * @param words 敏感词数组
     */
    constructor(words: string[]);
    /**
     * 构建敏感词
     * @param words 敏感词
     */
    private buildTree;
    /**
     * 词汇去重复
     * @param words 敏感词
     */
    private dedupAndSort;
    /**
     * 添加词汇
     * @param root
     * @param word
     */
    private addWord;
    /**
     *
     * @param root
     */
    private fallbackAll;
    /**
     * 查询匹配的词汇以及所在字符串的位置
     * @param content 需要进行匹配的内容
     * @param options quick=true 只选第一个词，longest=true 位置相同，返回最长的词
     */
    search(content: any, options: any): any[];
    private collect;
    private selectLongest;
    /**
     *  匹配关键词命中次数
     * @param content 需要进行匹配的内容
     * @param options quick=true 只选第一个词，longest=true 位置相同，返回最长的词
     */
    hits(content: any, options: any): {
        code: boolean;
        seen: {};
    };
    /**
     * 判断对象是否为空
     * @param obj
     */
    private isEmptyObject;
}

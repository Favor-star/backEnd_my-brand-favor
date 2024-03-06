import testAdd from "./file"


describe("file.js",function(){
    test("add two numbers",function(){
        expect(testAdd(1,2)).toBe(3);
    })
})
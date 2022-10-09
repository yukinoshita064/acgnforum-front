/*
*  分页器
*
* */


class Pagination {
    constructor(dataAll, perPage) {
        this.dataAll = dataAll
        if (this.dataAll.length === 0) {
            throw 'Data Not Fround'
        }
        this.perPage = perPage
        this.pageAll_cnt = Math.ceil(this.dataAll.length / this.perPage)
        if (perPage === 1) {
            throw 'Data of per page is too short'
        }
    }

    get(requestPage) {
        if (requestPage > this.pageAll_cnt) {
            throw 'Overflow'
        }
        if (requestPage <= 0) {
            throw 'Less than 0'
        }
        if (requestPage === 1) {
            return this.dataAll.slice(0, this.perPage)
        }
        if (requestPage === this.pageAll_cnt) {
            const start = this.perPage * (requestPage - 1)
            return this.dataAll.slice(start, this.dataAll.length)
        }
        const unit = this.perPage * requestPage
        return this.dataAll.slice(unit - 3, unit)
    }

    getCount(){
        return this.pageAll_cnt
    }
}

export default Pagination
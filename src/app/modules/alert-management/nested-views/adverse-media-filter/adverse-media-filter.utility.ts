export namespace AdverseMediaFilterUtility {

    export function filterSelectedAdverseMediaData(items: any) {
        let filterData = []
        filterData = items.filter(item => item.completed || item.hit_generated.some(hitValue => hitValue.completed)).flatMap(res => res.completed ? res.hit_generated : res.hit_generated.filter(hitValue => hitValue.completed));
        return filterData
    }
}
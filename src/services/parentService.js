export default class ParentService {
    static getAllParents() {
        return `${SessionInfoService.getBaseUrlForAPI()}parents`;
    }

    static getParent(parentId) {

    }
}
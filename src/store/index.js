import { createStore } from 'vuex'
import { createInitialWorkflow } from "../translator/middle-g6/nodeEditor"

const store = createStore({
    // 数据
    state: {
        workflow: null,
        middleNodeRepository: new Map()
    },
    // 修改数据
    mutations: {
        // 新建 workflow
        createWorkflow(state) {
            state.workflow = createInitialWorkflow(state.middleNodeRepository);
        },
        // 更新 workflow
        updateWorkflow(state, newWorkflow) {
            state.workflow = newWorkflow;
        },
        // 更新 middleNodeRepository
        updateMiddleNodeRepository(state, newMiddleNodeRepository) {
            state.middleNodeRepository = newMiddleNodeRepository;
        }
    },
    getters: {
        // 获得 workflow
        getWorkflow(state) {
            return state.workflow;
        },
        // 获得 middleNodeRepository
        getMiddleNodeRepository(state) {
            return state.middleNodeRepository;
        }
    },
    actions: {}
})

export default store
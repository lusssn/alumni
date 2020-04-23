import * as R from "../../utils/ramda/index";
import * as Api from "../api";
import * as Util from "../../utils/util";
import wxUtil from "../../utils/wxUtil";

const app = getApp();

const PAGE_SIZE = 10;

const SERVICE_NAV_CONFIG = [
  { index: 0, img: "../../images/alumni-center.png", text: "校友会中心" },
  { index: 1, img: "../../images/alumni-activities.png", text: "校友活动" },
  { index: 2, img: "../../images/hub.png", text: "校友圈" },
  { index: 3, img: "../../images/alumni-news.png", text: "校友风采" }
];

Page({
  data: {
    NAV: SERVICE_NAV_CONFIG,
    demandList: null,
    isLoaded: false,
    filter: 0,
    pagination: { current: 1, total: 0 },
    banner: []
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadDemandList();
      this.loadBanner();
      wxUtil.getNoticeCount().then(count => {
        if (count > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: count.toString()
          });
        } else {
          wx.removeTabBarBadge({
            index: 2
          });
          // 检查消息订阅状态
          wxUtil.checkSubscribeStatus();
        }
      });
    });
  },
  onPullDownRefresh() {
    this.loadDemandList().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom() {
    const { current, total } = this.data.pagination;
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadDemandList(current + 1);
    }
  },
  loadBanner() {
    Api.getBanner().then(res => {
      this.setData({
        banner: res
      });
    });
  },
  loadDemandList(pageNo = 1) {
    this.setData({
      isLoaded: false
    });
    return Api.getDemands({
      type: this.data.filter,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE
    }).then(
      res => {
        const { list, count } = res;
        this.setData({
          isLoaded: true,
          demandList: pageNo === 1 ? list : this.data.list.concat(list),
          pagination: {
            current: pageNo,
            total: count
          }
        });
      },
      err => {
        this.setData({ isLoaded: true });
        wxUtil.showToast(err.errMsg);
      }
    );
  },
  handleClickSearch() {
    wxUtil.navigateTo("search");
  },
  handleClickFilter(e) {
    const { filter } = e.target.dataset;
    if (!isNaN(filter) && filter !== this.data.filter) {
      this.setData({ filter }, () => {
        this.loadDemandList();
      });
    }
  },
  handleClickBanner(e){
    const { banner } = this.data;
    const { index } = e.currentTarget.dataset;
    wxUtil.navigateTo("article", { link: banner[index].link });
  },
  handleToDemandDetail(e) {
    const { id } = e.currentTarget.dataset;
    wxUtil.navigateTo("demandDetail", { demandId: id });
  },
  handleToCreateDemand() {
    wxUtil.navigateTo("demandCreate");
  }
});

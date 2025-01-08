import axios from "axios";
class ProjectService {
  constructor() {}
  validateLogin(body = {}) {
    return axios.post("http://localhost:3000/login", body);
  }
  registration(body = {}) {
    return axios.post("http://localhost:3000/signup", body);
  }
  logOut() {
    return axios.post("http://localhost:3000/logout");
  }
  importData(params) {
    let sortingOrder;
    if (params.limit == -1) {
      params.limit = "All";
    }
    if (!params.sortBy && !params.sortDesc) {
      params.sortBy = "id";
      sortingOrder = "desc";
    } else if (params.sortDesc) {
      sortingOrder = "desc";
    } else {
      sortingOrder = "asc";
    }
    // console.log(params);
    return axios.get(
      `http://localhost:3000/getusers?offset=${params.offset}&limit=${params.limit}&sortBy=${params.sortBy}&sortOrder=${sortingOrder}&filter=${params.filter}`
    );
  }
  importAuditTrailData() {
    return axios.get("http://localhost:3000/getAuditTrail");
  }
  editData(userId, body = {}) {
    return axios.patch(`http://localhost:3000/update/user/${userId}`, body);
  }
  editRole(userId, body = {}) {
    return axios.patch(`http://localhost:3000/update/userRole/${userId}`, body);
  }
  deleteData(body = {}) {
    console.log(body);
    return axios.delete("http://localhost:3000/delete/user", {
      data: { id: body.id, loggedUserID: body.loggedUserID },
    });
  }
}
export default ProjectService;

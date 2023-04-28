function sweetDelete(id, title) {
  swal({
          title: "delete Employee?",
          text: "Are you sure you want to delete this employee data?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
      })
      .then((willDelete) => {
          if (willDelete) {
              deleteDataFromLocalStorage(id, title);
              swal("employee data has been deleted!", {
                  icon: "success",
              });
          } else {
              swal("Your employee data is safe!");
          }
      });
}
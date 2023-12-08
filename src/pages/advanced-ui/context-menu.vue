<template>
  <section class="loader">
    <div class="page-header">
      <h3 class="page-title"> Context menu </h3>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">UI Elements</a></li>
          <li class="breadcrumb-item active" aria-current="page">Context menu</li>
        </ol>
      </nav>
    </div>
    <div class="row">
    <div class="col-md-6 grid-margin">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">simple</h4>
          <p class="card-description"> A simple context menu </p>
          <div class="card card-inverse-info context-menu-styled">
            <div class="card-body">
              <contextMenu></contextMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 grid-margin">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Access keys</h4>
          <p class="card-description"> Context menu with actions </p>
          <div class="card card-inverse-success context-menu-styled">
            <div class="card-body">
              <contextMenuAction></contextMenuAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </section>
</template>
<script>
import contextMenu from '../../components/ui-feature/contect-menu'
import contextMenuAction from '../../components/ui-feature/contect-menu-action'
export default {
  components: {
    contextMenu,
    contextMenuAction
  },
}
</script>


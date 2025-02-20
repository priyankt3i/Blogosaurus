import logo from '../../assets/logo-dark.svg';
import { Link, useParams } from 'react-router-dom';
import React, { memo, useEffect, useRef, useState } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { Parser } from '@alkhipce/editorjs-react';
import { EDITOR_JS_TOOLS, EDITOR_DEFAULT_VALUE } from './EditorConfig';
import SnackAlert from '../utils/SnackAlert';
import SaveBlogModal from '../utils/SaveBlogModal';
import PublishBlogModal from '../utils/PublishBlogModal';

const BlogEditor = () => {
  const { draftID } = useParams();
  const [previewMode, setPreviewMode] = useState(false);
  const [draftData, setDraftData] = useState(localStorage.getItem('draftEditor') ? JSON.parse(localStorage.getItem('draftEditor')) : {});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openSaveBlogModal, setOpenSaveBlogModal] = React.useState(false);
  const [openPublishBlogModal, setOpenPublishBlogModal] = React.useState(false);

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleClickOpenSaveBlogModal = () => {
    setOpenSaveBlogModal(true);
  };

  const handleCloseSaveBlogModal = () => {
    setOpenSaveBlogModal(false);
  };

  const handleClickOpenPublishBlogModal = () => {
    setOpenPublishBlogModal(true);
  };

  const handleClosePublishBlogModal = () => {
    setOpenPublishBlogModal(false);
  };

  const handlePreviewMode = () => {
    if (previewMode) {
      setPreviewMode(false);
    } else {
      handleSave();
      setPreviewMode(true);
    }
  };

  const ReactEditorJS = createReactEditorJS();
  const editorCore = React.useRef(null);

  const handleInitialize = React.useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleSave = React.useCallback(async () => {
    const savedData = await editorCore.current.save();
    setDraftData(savedData);
    console.log(savedData);
  }, []);

  const handleSaveBlogFlow = () => {
    if (previewMode) {
      handleSnackbarOpen();
    } else {
      handleSave();
      handleClickOpenSaveBlogModal();
    }
  };

  const handlePublishBlogFlow = () => {
    if (previewMode) {
      handleSnackbarOpen();
    } else {
      handleSave();
      handleClickOpenPublishBlogModal();
    }
  };

  return (
    <>
      <div className="m-4">
        <div className="flex justify-between">
          <div>
            <Link to="/dashboard">
              <img src={logo} alt="Blogosaurus" className="h-8 w-auto m-1" />
            </Link>
          </div>
          <div>
            <div>
              <button onClick={handlePreviewMode} className="px-4 py-1 m-1 rounded-full border border-gray-500 text-gray-500 inline-flex items-center">
                <span className="text-sm">{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
              <button onClick={handleSaveBlogFlow} className="px-4 py-1 m-1 rounded-full border border-gray-500 text-gray-500 inline-flex items-center">
                <span className="text-sm">Save</span>
              </button>
              <button onClick={handlePublishBlogFlow} className="px-4 py-1.5 m-1 rounded-full bg-gray-600 text-white inline-flex items-center">
                <span className="text-sm">Publish</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          {!previewMode ? (
            <ReactEditorJS placeholder='Type "/" for commands...' onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} defaultValue={draftData} />
          ) : (
            <div className="mx-4 sm:mx-8 lg:mx-12 xl:mx-80">
              <Parser data={draftData} />
            </div>
          )}
        </div>
        <SaveBlogModal open={openSaveBlogModal} handleClose={handleCloseSaveBlogModal} draftData={draftData} draftID={draftID} />
        <PublishBlogModal open={openPublishBlogModal} handleClose={handleClosePublishBlogModal} draftData={draftData} draftID={draftID} />
        <SnackAlert open={snackbarOpen} message="Toggle to edit-mode to save blog as a draft!" severity="warning" onClose={handleSnackbarClose} />
      </div>
    </>
  );
};

export default BlogEditor;

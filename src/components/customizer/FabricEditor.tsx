"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  Canvas,
  FabricImage,
  Textbox,
} from "fabric";

export type EditorSnapshot = {
  preview: string;
  json: string;
  objectCount: number;
};

type FabricEditorProps = {
  onChange?: (
    snapshot: EditorSnapshot
  ) => void;
};

type SelectedType =
  | "text"
  | "image"
  | null;

type TextAlignment =
  | "left"
  | "center"
  | "right";

/* ========================================================= */
/* CONFIGURACIÓN */
/* ========================================================= */

const HISTORY_LIMIT = 40;

const FONT_OPTIONS = [
  "Arial",
  "Arial Black",
  "Impact",
  "Verdana",
  "Trebuchet MS",
  "Georgia",
  "Times New Roman",
  "Courier New",
];

/* ========================================================= */
/* ARCHIVO → DATA URL */
/* ========================================================= */

function fileToDataUrl(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result ===
          "string"
        ) {
          resolve(
            reader.result
          );

          return;
        }

        reject(
          new Error(
            "No fue posible leer la imagen."
          )
        );
      };

      reader.onerror = () => {
        reject(
          new Error(
            "No fue posible leer la imagen."
          )
        );
      };

      reader.readAsDataURL(
        file
      );
    }
  );
}

/* ========================================================= */
/* COMPONENTE */
/* ========================================================= */

export default function FabricEditor({
  onChange,
}: FabricEditorProps) {
  const htmlCanvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const fabricCanvasRef =
    useRef<Canvas | null>(
      null
    );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const onChangeRef =
    useRef(onChange);

  const snapshotFrameRef =
    useRef<number | null>(
      null
    );

  /* ======================================================= */
  /* HISTORIAL */
  /* ======================================================= */

  const undoStackRef =
    useRef<string[]>([]);

  const redoStackRef =
    useRef<string[]>([]);

  const restoringHistoryRef =
    useRef(false);

  const [
    canUndo,
    setCanUndo,
  ] = useState(false);

  const [
    canRedo,
    setCanRedo,
  ] = useState(false);

  /* ======================================================= */
  /* INPUT ÚNICO */
  /* ======================================================= */

  const reactId =
    useId();

  const uploadInputId =
    `professional-logo-${reactId.replace(
      /:/g,
      ""
    )}`;

  /* ======================================================= */
  /* ESTADO GENERAL */
  /* ======================================================= */

  const [
    textValue,
    setTextValue,
  ] = useState(
    "Tu texto"
  );

  const [
    selectedType,
    setSelectedType,
  ] =
    useState<SelectedType>(
      null
    );

  const [
    objectCount,
    setObjectCount,
  ] = useState(0);

  /* ======================================================= */
  /* TRANSFORMACIÓN DEL ELEMENTO */
  /* ======================================================= */

  const [
    selectedX,
    setSelectedX,
  ] = useState(0);

  const [
    selectedY,
    setSelectedY,
  ] = useState(0);

  const [
    selectedAngle,
    setSelectedAngle,
  ] = useState(0);

  const [
    selectedScale,
    setSelectedScale,
  ] = useState(100);

  /* ======================================================= */
  /* ESTADO DEL TEXTO */
  /* ======================================================= */

  const [
    selectedTextColor,
    setSelectedTextColor,
  ] = useState(
    "#ffffff"
  );

  const [
    selectedFontFamily,
    setSelectedFontFamily,
  ] = useState(
    "Arial"
  );

  const [
    selectedFontSize,
    setSelectedFontSize,
  ] = useState(
    42
  );

  const [
    selectedBold,
    setSelectedBold,
  ] = useState(
    true
  );

  const [
    selectedItalic,
    setSelectedItalic,
  ] = useState(
    false
  );

  const [
    selectedAlignment,
    setSelectedAlignment,
  ] =
    useState<TextAlignment>(
      "center"
    );

  /* ======================================================= */
  /* CALLBACK */
  /* ======================================================= */

  useEffect(() => {
    onChangeRef.current =
      onChange;
  }, [onChange]);

  /* ======================================================= */
  /* BOTONES HISTORIAL */
  /* ======================================================= */

  const updateHistoryButtons =
    useCallback(() => {
      setCanUndo(
        undoStackRef.current
          .length > 1
      );

      setCanRedo(
        redoStackRef.current
          .length > 0
      );
    }, []);

  /* ======================================================= */
  /* SNAPSHOT / VISTA 3D */
  /* ======================================================= */

  const emitSnapshot =
    useCallback(() => {
      const canvas =
        fabricCanvasRef.current;

      if (!canvas) {
        return;
      }

      if (
        snapshotFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          snapshotFrameRef.current
        );
      }

      snapshotFrameRef.current =
        requestAnimationFrame(
          () => {
            const currentCanvas =
              fabricCanvasRef.current;

            if (!currentCanvas) {
              return;
            }

            currentCanvas.renderAll();

            const count =
              currentCanvas
                .getObjects()
                .length;

            setObjectCount(
              count
            );

            const preview =
              currentCanvas.toDataURL(
                {
                  format: "png",
                  multiplier: 1,
                }
              );

            const json =
              JSON.stringify(
                currentCanvas.toJSON()
              );

            onChangeRef.current?.({
              preview,
              json,
              objectCount:
                count,
            });

            snapshotFrameRef.current =
              null;
          }
        );
    }, []);

  /* ======================================================= */
  /* GUARDAR HISTORIAL */
  /* ======================================================= */

  const saveHistory =
    useCallback(() => {
      const canvas =
        fabricCanvasRef.current;

      if (
        !canvas ||
        restoringHistoryRef.current
      ) {
        return;
      }

      const json =
        JSON.stringify(
          canvas.toJSON()
        );

      const history =
        undoStackRef.current;

      const last =
        history[
          history.length - 1
        ];

      if (last === json) {
        return;
      }

      history.push(
        json
      );

      if (
        history.length >
        HISTORY_LIMIT
      ) {
        history.shift();
      }

      redoStackRef.current =
        [];

      updateHistoryButtons();
    }, [
      updateHistoryButtons,
    ]);

  /* ======================================================= */
  /* RESTAURAR HISTORIAL */
  /* ======================================================= */

  const restoreState =
    useCallback(
      async (
        json: string
      ) => {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return;
        }

        restoringHistoryRef.current =
          true;

        canvas.discardActiveObject();

        try {
          await canvas.loadFromJSON(
            json
          );

          canvas.renderAll();

          setSelectedType(
            null
          );

          setSelectedX(0);
          setSelectedY(0);
          setSelectedAngle(0);
          setSelectedScale(100);

          emitSnapshot();
        } catch (error) {
          console.error(
            "Error restaurando historial:",
            error
          );
        } finally {
          restoringHistoryRef.current =
            false;

          updateHistoryButtons();
        }
      },
      [
        emitSnapshot,
        updateHistoryButtons,
      ]
    );

  /* ======================================================= */
  /* DESHACER */
  /* ======================================================= */

  const undo =
    useCallback(async () => {
      if (
        restoringHistoryRef.current
      ) {
        return;
      }

      if (
        undoStackRef.current
          .length <= 1
      ) {
        return;
      }

      const current =
        undoStackRef.current.pop();

      if (current) {
        redoStackRef.current.push(
          current
        );
      }

      const previous =
        undoStackRef.current[
          undoStackRef.current
            .length - 1
        ];

      if (previous) {
        await restoreState(
          previous
        );
      }

      updateHistoryButtons();
    }, [
      restoreState,
      updateHistoryButtons,
    ]);

  /* ======================================================= */
  /* REHACER */
  /* ======================================================= */

  const redo =
    useCallback(async () => {
      if (
        restoringHistoryRef.current
      ) {
        return;
      }

      const next =
        redoStackRef.current.pop();

      if (!next) {
        return;
      }

      undoStackRef.current.push(
        next
      );

      await restoreState(
        next
      );

      updateHistoryButtons();
    }, [
      restoreState,
      updateHistoryButtons,
    ]);

  /* ======================================================= */
  /* SINCRONIZAR TEXTO */
  /* ======================================================= */

  const syncTextControls =
    useCallback(
      (
        text: Textbox
      ) => {
        const fill =
          text.fill;

        if (
          typeof fill ===
          "string"
        ) {
          setSelectedTextColor(
            fill
          );
        }

        setSelectedFontFamily(
          text.fontFamily ||
            "Arial"
        );

        setSelectedFontSize(
          Math.round(
            text.fontSize ||
              42
          )
        );

        setSelectedBold(
          text.fontWeight ===
            "bold" ||
            Number(
              text.fontWeight
            ) >= 600
        );

        setSelectedItalic(
          text.fontStyle ===
            "italic"
        );

        const alignment =
          text.textAlign;

        if (
          alignment ===
            "left" ||
          alignment ===
            "center" ||
          alignment ===
            "right"
        ) {
          setSelectedAlignment(
            alignment
          );
        }
      },
      []
    );

  /* ======================================================= */
  /* SINCRONIZAR POSICIÓN / ROTACIÓN / ESCALA */
  /* ======================================================= */

  const syncTransformControls =
    useCallback(() => {
      const canvas =
        fabricCanvasRef.current;

      if (!canvas) {
        return;
      }

      const active =
        canvas.getActiveObject();

      if (!active) {
        setSelectedX(0);
        setSelectedY(0);
        setSelectedAngle(0);
        setSelectedScale(100);

        return;
      }

      setSelectedX(
        Math.round(
          active.left ?? 0
        )
      );

      setSelectedY(
        Math.round(
          active.top ?? 0
        )
      );

      setSelectedAngle(
        Math.round(
          active.angle ?? 0
        )
      );

      const scaleX =
        active.scaleX ?? 1;

      const scaleY =
        active.scaleY ?? 1;

      setSelectedScale(
        Math.round(
          (
            (
              scaleX +
              scaleY
            ) /
            2
          ) * 100
        )
      );
    }, []);

  /* ======================================================= */
  /* CREAR CANVAS */
  /* ======================================================= */

  useEffect(() => {
    if (
      !htmlCanvasRef.current
    ) {
      return;
    }

    const canvas =
      new Canvas(
        htmlCanvasRef.current,
        {
          width: 500,
          height: 560,

          backgroundColor:
            "transparent",

          preserveObjectStacking:
            true,

          selection: true,
        }
      );

    fabricCanvasRef.current =
      canvas;

    /* ===================================================== */
    /* SELECCIÓN */
    /* ===================================================== */

    const updateSelection =
      () => {
        const active =
          canvas.getActiveObject();

        syncTransformControls();

        if (!active) {
          setSelectedType(
            null
          );

          return;
        }

        if (
          active instanceof
          Textbox
        ) {
          setSelectedType(
            "text"
          );

          syncTextControls(
            active
          );

          return;
        }

        setSelectedType(
          "image"
        );
      };

    /* ===================================================== */
    /* EVENTOS */
    /* ===================================================== */

    const handleAdded =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        emitSnapshot();
        saveHistory();
      };

    const handleRemoved =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        emitSnapshot();
        saveHistory();
      };

    const handleModified =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        syncTransformControls();

        emitSnapshot();
        saveHistory();

        const active =
          canvas.getActiveObject();

        if (
          active instanceof
          Textbox
        ) {
          syncTextControls(
            active
          );
        }
      };

    const handleLiveChange =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        syncTransformControls();

        emitSnapshot();
      };

    canvas.on(
      "selection:created",
      updateSelection
    );

    canvas.on(
      "selection:updated",
      updateSelection
    );

    canvas.on(
      "selection:cleared",
      updateSelection
    );

    canvas.on(
      "object:added",
      handleAdded
    );

    canvas.on(
      "object:removed",
      handleRemoved
    );

    canvas.on(
      "object:modified",
      handleModified
    );

    canvas.on(
      "object:moving",
      handleLiveChange
    );

    canvas.on(
      "object:scaling",
      handleLiveChange
    );

    canvas.on(
      "object:rotating",
      handleLiveChange
    );

    canvas.on(
      "text:changed",
      handleLiveChange
    );

    /* ===================================================== */
    /* ESTADO INICIAL */
    /* ===================================================== */

    undoStackRef.current = [
      JSON.stringify(
        canvas.toJSON()
      ),
    ];

    redoStackRef.current =
      [];

    updateHistoryButtons();

    emitSnapshot();

    /* ===================================================== */
    /* CLEANUP */
    /* ===================================================== */

    return () => {
      if (
        snapshotFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          snapshotFrameRef.current
        );
      }

      fabricCanvasRef.current =
        null;

      canvas.dispose();
    };
  }, [
    emitSnapshot,
    saveHistory,
    updateHistoryButtons,
    syncTextControls,
    syncTransformControls,
  ]);

  /* ======================================================= */
  /* OBJETO ACTIVO */
  /* ======================================================= */

  function getActiveObject() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return null;
    }

    return canvas.getActiveObject();
  }

  /* ======================================================= */
  /* TEXTO ACTIVO */
  /* ======================================================= */

  function getActiveText() {
    const active =
      getActiveObject();

    if (
      !(
        active instanceof
        Textbox
      )
    ) {
      return null;
    }

    return active;
  }

  /* ======================================================= */
  /* FINALIZAR CAMBIO */
  /* ======================================================= */

  function finishChange() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const active =
      canvas.getActiveObject();

    active?.setCoords();

    canvas.requestRenderAll();

    syncTransformControls();

    emitSnapshot();

    saveHistory();
  }

  /* ======================================================= */
  /* AGREGAR TEXTO */
  /* ======================================================= */

  function addText() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const value =
      textValue.trim() ||
      "Tu texto";

    const text =
      new Textbox(
        value,
        {
          left: 150,
          top: 180,

          width: 200,

          fill:
            selectedTextColor,

          fontSize:
            selectedFontSize,

          fontWeight:
            selectedBold
              ? "bold"
              : "normal",

          fontStyle:
            selectedItalic
              ? "italic"
              : "normal",

          fontFamily:
            selectedFontFamily,

          textAlign:
            selectedAlignment,

          originX:
            "left",

          originY:
            "top",

          transparentCorners:
            false,

          cornerColor:
            "#dc2626",

          cornerStrokeColor:
            "#ffffff",

          borderColor:
            "#dc2626",

          cornerSize: 12,

          padding: 8,
        }
      );

    canvas.add(
      text
    );

    canvas.setActiveObject(
      text
    );

    canvas.renderAll();

    setSelectedType(
      "text"
    );

    syncTextControls(
      text
    );

    syncTransformControls();

    emitSnapshot();
  }

  /* ======================================================= */
  /* AGREGAR IMÁGENES */
  /* ======================================================= */

  async function addImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const files =
      Array.from(
        event.target.files ??
          []
      );

    if (
      files.length === 0
    ) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    for (
      let index = 0;
      index <
      files.length;
      index += 1
    ) {
      const file =
        files[index];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        continue;
      }

      try {
        const dataUrl =
          await fileToDataUrl(
            file
          );

        const image =
          await FabricImage.fromURL(
            dataUrl
          );

        const originalWidth =
          image.width || 1;

        const originalHeight =
          image.height || 1;

        const maximumWidth =
          190;

        const maximumHeight =
          190;

        const scale =
          Math.min(
            maximumWidth /
              originalWidth,

            maximumHeight /
              originalHeight,

            1
          );

        image.set({
          left:
            155 +
            index * 12,

          top:
            170 +
            index * 12,

          transparentCorners:
            false,

          cornerColor:
            "#dc2626",

          cornerStrokeColor:
            "#ffffff",

          borderColor:
            "#dc2626",

          cornerSize: 12,

          padding: 6,
        });

        image.scale(
          scale
        );

        canvas.add(
          image
        );

        canvas.setActiveObject(
          image
        );

        setSelectedType(
          "image"
        );
      } catch (error) {
        console.error(
          "No fue posible agregar la imagen:",
          error
        );
      }
    }

    canvas.renderAll();

    syncTransformControls();

    emitSnapshot();

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  }

  /* ======================================================= */
  /* ELIMINAR */
  /* ======================================================= */

  function deleteSelected() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const activeObjects =
      canvas.getActiveObjects();

    if (
      activeObjects.length ===
      0
    ) {
      return;
    }

    restoringHistoryRef.current =
      true;

    activeObjects.forEach(
      (object) => {
        canvas.remove(
          object
        );
      }
    );

    restoringHistoryRef.current =
      false;

    canvas.discardActiveObject();

    canvas.renderAll();

    setSelectedType(
      null
    );

    setSelectedX(0);
    setSelectedY(0);
    setSelectedAngle(0);
    setSelectedScale(100);

    emitSnapshot();
    saveHistory();
  }

  /* ======================================================= */
  /* DUPLICAR */
  /* ======================================================= */

  async function duplicateSelected() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const active =
      canvas.getActiveObject();

    if (!active) {
      return;
    }

    try {
      const clone =
        await active.clone();

      clone.set({
        left:
          (active.left ??
            0) + 20,

        top:
          (active.top ??
            0) + 20,

        evented: true,
      });

      canvas.add(
        clone
      );

      canvas.setActiveObject(
        clone
      );

      canvas.renderAll();

      if (
        clone instanceof
        Textbox
      ) {
        setSelectedType(
          "text"
        );

        syncTextControls(
          clone
        );
      } else {
        setSelectedType(
          "image"
        );
      }

      syncTransformControls();

      emitSnapshot();
    } catch (error) {
      console.error(
        "No fue posible duplicar el elemento:",
        error
      );
    }
  }

  /* ======================================================= */
  /* AJUSTE PRECISO: X */
  /* ======================================================= */

  function updatePositionX(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active ||
      Number.isNaN(value)
    ) {
      return;
    }

    setSelectedX(
      value
    );

    active.set({
      left: value,
    });

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* AJUSTE PRECISO: Y */
  /* ======================================================= */

  function updatePositionY(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active ||
      Number.isNaN(value)
    ) {
      return;
    }

    setSelectedY(
      value
    );

    active.set({
      top: value,
    });

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* AJUSTE PRECISO: ROTACIÓN */
  /* ======================================================= */

  function updateObjectAngle(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    setSelectedAngle(
      value
    );

    active.rotate(
      value
    );

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* AJUSTE PRECISO: ESCALA */
  /* ======================================================= */

  function updateObjectScale(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    const safeValue =
      Math.min(
        Math.max(
          value,
          10
        ),
        300
      );

    const scale =
      safeValue / 100;

    setSelectedScale(
      safeValue
    );

    active.set({
      scaleX:
        scale,

      scaleY:
        scale,
    });

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* GUARDAR TRANSFORMACIÓN */
  /* ======================================================= */

  function saveTransformChange() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const active =
      canvas.getActiveObject();

    if (!active) {
      return;
    }

    active.setCoords();

    canvas.requestRenderAll();

    syncTransformControls();

    emitSnapshot();

    saveHistory();
  }

  /* ======================================================= */
  /* CENTRAR HORIZONTAL */
  /* ======================================================= */

  function centerHorizontal() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    const bounds =
      active.getBoundingRect();

    const currentCenter =
      bounds.left +
      bounds.width / 2;

    const desiredCenter =
      canvas.getWidth() / 2;

    const difference =
      desiredCenter -
      currentCenter;

    active.set({
      left:
        (active.left ??
          0) +
        difference,
    });

    active.setCoords();

    finishChange();
  }

  /* ======================================================= */
  /* CENTRAR VERTICAL */
  /* ======================================================= */

  function centerVertical() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    const bounds =
      active.getBoundingRect();

    const currentCenter =
      bounds.top +
      bounds.height / 2;

    const desiredCenter =
      canvas.getHeight() / 2;

    const difference =
      desiredCenter -
      currentCenter;

    active.set({
      top:
        (active.top ??
          0) +
        difference,
    });

    active.setCoords();

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: SUBIR */
  /* ======================================================= */

  function moveLayerUp() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.bringObjectForward(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: BAJAR */
  /* ======================================================= */

  function moveLayerDown() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.sendObjectBackwards(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: AL FRENTE */
  /* ======================================================= */

  function moveLayerToFront() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.bringObjectToFront(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: AL FONDO */
  /* ======================================================= */

  function moveLayerToBack() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.sendObjectToBack(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
  }

  /* ======================================================= */
  /* COLOR TEXTO */
  /* ======================================================= */

  function updateTextColor(
    color: string
  ) {
    setSelectedTextColor(
      color
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fill: color,
    });

    finishChange();
  }

  /* ======================================================= */
  /* TIPOGRAFÍA */
  /* ======================================================= */

  function updateFontFamily(
    fontFamily: string
  ) {
    setSelectedFontFamily(
      fontFamily
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontFamily,
    });

    finishChange();
  }

  /* ======================================================= */
  /* TAMAÑO DE LETRA */
  /* ======================================================= */

  function updateFontSize(
    size: number
  ) {
    const safeSize =
      Math.min(
        Math.max(
          size,
          12
        ),
        120
      );

    setSelectedFontSize(
      safeSize
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontSize:
        safeSize,
    });

    finishChange();
  }

  /* ======================================================= */
  /* NEGRITA */
  /* ======================================================= */

  function toggleBold() {
    const next =
      !selectedBold;

    setSelectedBold(
      next
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontWeight:
        next
          ? "bold"
          : "normal",
    });

    finishChange();
  }

  /* ======================================================= */
  /* CURSIVA */
  /* ======================================================= */

  function toggleItalic() {
    const next =
      !selectedItalic;

    setSelectedItalic(
      next
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontStyle:
        next
          ? "italic"
          : "normal",
    });

    finishChange();
  }

  /* ======================================================= */
  /* ALINEACIÓN */
  /* ======================================================= */

  function updateAlignment(
    alignment: TextAlignment
  ) {
    setSelectedAlignment(
      alignment
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      textAlign:
        alignment,
    });

    finishChange();
  }

  /* ======================================================= */
  /* LIMPIAR */
  /* ======================================================= */

  function clearCanvas() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const objects =
      [...canvas.getObjects()];

    if (
      objects.length === 0
    ) {
      return;
    }

    restoringHistoryRef.current =
      true;

    objects.forEach(
      (object) => {
        canvas.remove(
          object
        );
      }
    );

    restoringHistoryRef.current =
      false;

    canvas.discardActiveObject();

    canvas.renderAll();

    setSelectedType(
      null
    );

    setSelectedX(0);
    setSelectedY(0);
    setSelectedAngle(0);
    setSelectedScale(100);

    emitSnapshot();
    saveHistory();
  }

  /* ======================================================= */
  /* ATAJOS */
  /* ======================================================= */

  useEffect(() => {
    const handleKeyboard =
      (
        event: KeyboardEvent
      ) => {
        const target =
          event.target as
            | HTMLElement
            | null;

        if (
          target?.tagName ===
            "INPUT" ||
          target?.tagName ===
            "TEXTAREA" ||
          target?.tagName ===
            "SELECT"
        ) {
          return;
        }

        const commandKey =
          event.ctrlKey ||
          event.metaKey;

        if (!commandKey) {
          return;
        }

        if (
          event.key.toLowerCase() ===
            "z" &&
          !event.shiftKey
        ) {
          event.preventDefault();

          void undo();

          return;
        }

        if (
          event.key.toLowerCase() ===
            "y" ||
          (
            event.key.toLowerCase() ===
              "z" &&
            event.shiftKey
          )
        ) {
          event.preventDefault();

          void redo();
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    undo,
    redo,
  ]);

  /* ======================================================= */
  /* UI */
  /* ======================================================= */

  return (
    <div className="grid w-full min-w-0 gap-5 overflow-hidden">

      {/* ================================================= */}
      {/* HISTORIAL */}
      {/* ================================================= */}

      <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111] p-4">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
              Historial
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              Deshaz o recupera tus últimos cambios.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void undo()
              }
              disabled={
                !canUndo
              }
              title="Deshacer"
              aria-label="Deshacer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black text-2xl font-bold text-white transition hover:border-red-500/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↶
            </button>

            <button
              type="button"
              onClick={() =>
                void redo()
              }
              disabled={
                !canRedo
              }
              title="Rehacer"
              aria-label="Rehacer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black text-2xl font-bold text-white transition hover:border-red-500/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↷
            </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* HERRAMIENTAS */}
      {/* ================================================= */}

      <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111] p-5">
        <div className="flex min-w-0 flex-col gap-5">

          {/* ============================================= */}
          {/* AGREGAR TEXTO */}
          {/* ============================================= */}

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
              Agregar texto
            </p>

            <div className="mt-3 flex min-w-0 gap-2">
              <input
                type="text"
                value={
                  textValue
                }
                onChange={(
                  event
                ) =>
                  setTextValue(
                    event.target.value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    addText();
                  }
                }}
                placeholder="Escribe tu texto"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500"
              />

              <button
                type="button"
                onClick={
                  addText
                }
                className="shrink-0 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
              >
                + Texto
              </button>
            </div>
          </div>

          {/* ============================================= */}
          {/* LOGOS */}
          {/* ============================================= */}

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
              Agregar logos
            </p>

            <label
              htmlFor={
                uploadInputId
              }
              className="mt-3 flex min-w-0 cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-black px-4 py-4 transition hover:border-red-500/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  Subir logos o imágenes
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  PNG, JPG o WEBP. Puedes seleccionar varios.
                </p>
              </div>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-xl text-white">
                +
              </span>
            </label>

            <input
              ref={
                fileInputRef
              }
              id={
                uploadInputId
              }
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={
                addImages
              }
              className="hidden"
            />
          </div>

          {/* ============================================= */}
          {/* EDITOR DE TEXTO */}
          {/* ============================================= */}

          {selectedType ===
            "text" && (
            <div className="border-t border-white/10 pt-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                  Editor de texto
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Personaliza el texto seleccionado.
                </p>
              </div>

              {/* TIPOGRAFÍA */}

              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Tipografía
                </label>

                <select
                  value={
                    selectedFontFamily
                  }
                  onChange={(
                    event
                  ) =>
                    updateFontFamily(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                >
                  {FONT_OPTIONS.map(
                    (font) => (
                      <option
                        key={
                          font
                        }
                        value={
                          font
                        }
                        style={{
                          fontFamily:
                            font,
                        }}
                      >
                        {font}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* TAMAÑO DE LETRA */}

              <div className="mt-5">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Tamaño de letra
                  </label>

                  <span className="rounded-lg border border-white/10 bg-black px-3 py-1 text-xs font-bold text-white">
                    {
                      selectedFontSize
                    }
                    px
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateFontSize(
                        selectedFontSize -
                          2
                      )
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black text-lg font-bold text-white transition hover:border-red-500"
                  >
                    −
                  </button>

                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="1"
                    value={
                      selectedFontSize
                    }
                    onChange={(
                      event
                    ) =>
                      updateFontSize(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="min-w-0 flex-1 accent-red-600"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateFontSize(
                        selectedFontSize +
                          2
                      )
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black text-lg font-bold text-white transition hover:border-red-500"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ESTILO */}

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Estilo
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={
                      toggleBold
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                      selectedBold
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/10 bg-black text-white hover:border-white/30"
                    }`}
                  >
                    B Negrita
                  </button>

                  <button
                    type="button"
                    onClick={
                      toggleItalic
                    }
                    className={`rounded-xl border px-4 py-3 text-sm italic transition ${
                      selectedItalic
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/10 bg-black text-white hover:border-white/30"
                    }`}
                  >
                    I Cursiva
                  </button>
                </div>
              </div>

              {/* ALINEACIÓN */}

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Alineación
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateAlignment(
                        "left"
                      )
                    }
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                      selectedAlignment ===
                      "left"
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/10 bg-black text-white hover:border-white/30"
                    }`}
                  >
                    Izq.
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateAlignment(
                        "center"
                      )
                    }
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                      selectedAlignment ===
                      "center"
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/10 bg-black text-white hover:border-white/30"
                    }`}
                  >
                    Centro
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateAlignment(
                        "right"
                      )
                    }
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                      selectedAlignment ===
                      "right"
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/10 bg-black text-white hover:border-white/30"
                    }`}
                  >
                    Der.
                  </button>
                </div>
              </div>

              {/* COLOR */}

              <div className="mt-5 flex min-w-0 items-center justify-between gap-4 rounded-xl border border-white/10 bg-black p-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    Color del texto
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Cambia el color en tiempo real.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs font-bold uppercase text-zinc-500">
                    {
                      selectedTextColor
                    }
                  </span>

                  <input
                    type="color"
                    value={
                      selectedTextColor
                    }
                    onChange={(
                      event
                    ) =>
                      updateTextColor(
                        event.target.value
                      )
                    }
                    className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-black p-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================= */}
          {/* AJUSTE PRECISO */}
          {/* ============================================= */}

          {selectedType && (
            <div className="border-t border-white/10 pt-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                  Ajuste preciso
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Controla la posición, tamaño y rotación del elemento.
                </p>
              </div>

              {/* POSICIÓN */}

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Posición
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      X
                    </span>

                    <input
                      type="number"
                      value={
                        selectedX
                      }
                      onChange={(
                        event
                      ) =>
                        updatePositionX(
                          Number(
                            event.target.value
                          )
                        )
                      }
                      onBlur={
                        saveTransformChange
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-500"
                    />
                  </label>

                  <label className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      Y
                    </span>

                    <input
                      type="number"
                      value={
                        selectedY
                      }
                      onChange={(
                        event
                      ) =>
                        updatePositionY(
                          Number(
                            event.target.value
                          )
                        )
                      }
                      onBlur={
                        saveTransformChange
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-500"
                    />
                  </label>
                </div>
              </div>

              {/* ROTACIÓN */}

              <div className="mt-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Rotación
                  </p>

                  <span className="rounded-lg border border-white/10 bg-black px-3 py-1 text-xs font-bold text-white">
                    {
                      selectedAngle
                    }
                    °
                  </span>
                </div>

                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={
                    selectedAngle
                  }
                  onChange={(
                    event
                  ) =>
                    updateObjectAngle(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  onPointerUp={
                    saveTransformChange
                  }
                  onBlur={
                    saveTransformChange
                  }
                  className="mt-3 w-full accent-red-600"
                />
              </div>

              {/* TAMAÑO */}

              <div className="mt-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Tamaño
                  </p>

                  <span className="rounded-lg border border-white/10 bg-black px-3 py-1 text-xs font-bold text-white">
                    {
                      selectedScale
                    }
                    %
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="300"
                  step="1"
                  value={
                    selectedScale
                  }
                  onChange={(
                    event
                  ) =>
                    updateObjectScale(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  onPointerUp={
                    saveTransformChange
                  }
                  onBlur={
                    saveTransformChange
                  }
                  className="mt-3 w-full accent-red-600"
                />
              </div>

              {/* CENTRADO */}

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Centrar elemento
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={
                      centerHorizontal
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50 hover:text-red-500"
                  >
                    ↔ Horizontal
                  </button>

                  <button
                    type="button"
                    onClick={
                      centerVertical
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50 hover:text-red-500"
                  >
                    ↕ Vertical
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================= */}
          {/* CAPAS */}
          {/* ============================================= */}

          {selectedType && (
            <div className="border-t border-white/10 pt-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                  Capas
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Controla qué elementos aparecen encima o debajo.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={
                    moveLayerUp
                  }
                  className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50 hover:text-red-500"
                >
                  ↑ Subir
                </button>

                <button
                  type="button"
                  onClick={
                    moveLayerDown
                  }
                  className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50 hover:text-red-500"
                >
                  ↓ Bajar
                </button>

                <button
                  type="button"
                  onClick={
                    moveLayerToFront
                  }
                  className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50 hover:text-red-500"
                >
                  ⇈ Al frente
                </button>

                <button
                  type="button"
                  onClick={
                    moveLayerToBack
                  }
                  className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50 hover:text-red-500"
                >
                  ⇊ Al fondo
                </button>
              </div>
            </div>
          )}

          {/* ============================================= */}
          {/* ELEMENTO SELECCIONADO */}
          {/* ============================================= */}

          <div className="border-t border-white/10 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
              Elemento seleccionado
            </p>

            <div className="mt-3 grid min-w-0 grid-cols-2 gap-2">
              <button
                type="button"
                onClick={
                  duplicateSelected
                }
                disabled={
                  !selectedType
                }
                className="min-w-0 rounded-xl border border-white/10 px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Duplicar
              </button>

              <button
                type="button"
                onClick={
                  deleteSelected
                }
                disabled={
                  !selectedType
                }
                className="min-w-0 rounded-xl border border-red-500/20 px-3 py-3 text-xs font-bold uppercase tracking-wider text-red-500 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CANVAS */}
      {/* ================================================= */}

      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#111_75%),linear-gradient(-45deg,transparent_75%,#111_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]">
        <div className="mx-auto w-full min-w-0 max-w-[500px] overflow-x-auto overflow-y-hidden">
          <canvas
            ref={
              htmlCanvasRef
            }
          />
        </div>
      </div>

      {/* ================================================= */}
      {/* ESTADO */}
      {/* ================================================= */}

      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 text-xs text-zinc-600">
          {objectCount === 0
            ? "Agrega texto o imágenes para comenzar."
            : `${objectCount} ${
                objectCount ===
                1
                  ? "elemento"
                  : "elementos"
              } en el diseño.`}
        </p>

        <button
          type="button"
          onClick={
            clearCanvas
          }
          disabled={
            objectCount === 0
          }
          className="shrink-0 text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-red-500 disabled:opacity-30"
        >
          Limpiar diseño
        </button>
      </div>

      {/* ================================================= */}
      {/* AYUDA */}
      {/* ================================================= */}

      <div className="w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-xs leading-5 text-zinc-500">
          Selecciona un elemento para moverlo,
          rotarlo, cambiar su tamaño, centrarlo o
          modificar su posición dentro de las
          capas. Todos los cambios se sincronizan
          automáticamente con la vista 3D.
        </p>
      </div>
    </div>
  );
}